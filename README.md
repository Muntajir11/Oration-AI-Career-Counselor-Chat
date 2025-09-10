# Career Counselor AI

A modern career counseling chat application built with Next.js, tRPC, TypeScript, and AI integration. This application provides personalized career guidance through an AI-powered chat interface with persistent conversation history.

## Features

- **AI-Powered Career Counseling**: Get intelligent career advice using advanced language models
- **Chat Session Management**: Create, view, and continue multiple chat sessions
- **Message Persistence**: All conversations are saved to a local SQLite database
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Chat Interface**: Smooth messaging experience with typing indicators
- **Session History**: Browse and continue previous conversations

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, React 19
- **Backend**: tRPC for type-safe API routes
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS with ShadCN UI components
- **Data Fetching**: TanStack Query for efficient caching
- **AI Integration**: Together.ai (configurable to use other providers)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# AI API Configuration
# For Together.ai (Free tier available)
TOGETHER_API_KEY=your_together_api_key_here
```

**To get a Together.ai API key:**
1. Visit [together.ai](https://together.ai)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to your `.env.local` file

### 3. Database Setup

```bash
# Generate and apply migrations
npm run db:generate
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a New Chat Session

1. Click the "New Chat" button in the sidebar
2. Enter a title for your chat session
3. Click "Create" to start chatting

### Asking Career Questions

You can ask questions about:
- Career planning and transitions
- Resume and interview preparation
- Skill development recommendations
- Industry insights and job market trends
- Salary negotiation strategies
- Work-life balance advice

### Managing Chat Sessions

- **View History**: All your chat sessions are listed in the sidebar
- **Continue Conversations**: Click on any previous session to continue where you left off
- **Delete Sessions**: Use the trash icon to delete unwanted chat sessions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
