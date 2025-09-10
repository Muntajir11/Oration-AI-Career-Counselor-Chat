import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const CAREER_COUNSELOR_SYSTEM_MESSAGE = `You are an expert career counselor and advisor with extensive knowledge in career development, job markets, skill assessment, and professional growth. Your role is to provide thoughtful, personalized career guidance to help individuals make informed decisions about their professional paths.

Key responsibilities:
- Assess individual strengths, interests, and career goals
- Provide insights about various career paths and industries
- Offer practical advice on skill development and career transitions
- Help with resume optimization and interview preparation
- Discuss salary negotiation and workplace dynamics
- Guide on work-life balance and professional development

Always maintain a supportive, professional tone and ask clarifying questions when needed to provide more tailored advice. Base your recommendations on current job market trends and best practices in career development.`;

export async function generateCareerAdvice(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      messages: [
        { role: "system", content: CAREER_COUNSELOR_SYSTEM_MESSAGE },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now. Please try again.";
  } catch (error) {
    console.error("Error generating career advice:", error);
    return "I'm sorry, but I'm experiencing technical difficulties. Please check your API configuration and try again.";
  }
}
