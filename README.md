# Career Counselor AI 🚀

A modern, AI-powered career counseling platform that provides personalized guidance through an intelligent chat interface. Built with cutting-edge technologies to deliver professional career advice with persistent conversation history and seamless user experience.

## 🌐 Live Demo

**Deployed Application**: [https://oration-ai-career-counselor-chat-j7.vercel.app/](https://oration-ai-career-counselor-chat-j7.vercel.app/)

## 📋 Project Overview

Career Counselor AI is a comprehensive web application designed to provide users with intelligent career guidance through AI-powered conversations. The platform features a modern chat interface, session management, user authentication, and responsive design optimized for both desktop and mobile devices.

## 🏗️ Folder Structure

```
careercounselor/
├── 📁 src/
│   ├── 🚀 app/                          # Next.js App Router directory
│   │   ├── 🔌 api/                      # API routes and endpoints
│   │   │   ├── 🔍 test-db/             # Database connectivity testing
│   │   │   └── ⚡ trpc/                # tRPC API configuration
│   │   ├── 🔐 auth/                     # Authentication pages
│   │   │   ├── 🔄 callback/            # OAuth callback handling
│   │   │   ├── 🔑 login/               # User login page
│   │   │   └── ✍️ signup/              # User registration page
│   │   ├── 🌟 favicon.ico              # Application favicon
│   │   ├── 🎨 globals.css              # Global CSS styles
│   │   ├── 🏗️ layout.tsx               # Root layout component
│   │   └── 🏠 page.tsx                 # Home page component
│   ├── 🧩 components/                   # Reusable React components
│   │   ├── 🔐 auth/                    # Authentication-related components
│   │   │   ├── 📋 AuthHeader.tsx       # Header with auth controls
│   │   │   └── 👤 UserManager.tsx      # User state management
│   │   ├── 💬 chat/                    # Chat interface components
│   │   │   ├── 🗨️ ChatInterface.tsx    # Main chat container
│   │   │   ├── 📊 ChatSidebar.tsx      # Session navigation sidebar
│   │   │   ├── 💭 MessageBubble.tsx    # Individual message display
│   │   │   ├── ⌨️ MessageInput.tsx     # Message input field
│   │   │   └── 📜 MessageList.tsx      # Message list container
│   │   ├── 🔧 providers/               # Context providers
│   │   │   └── 🌙 theme-provider.tsx   # Theme management provider
│   │   └── 🎯 ui/                      # Shadcn/ui components
│   │       ├── 🏷️ badge.tsx            # Badge component
│   │       ├── 🔘 button.tsx           # Button component
│   │       ├── 🃏 card.tsx             # Card component
│   │       ├── 📝 input.tsx            # Input field component
│   │       ├── 🏷️ label.tsx            # Label component
│   │       ├── 📄 textarea.tsx         # Textarea component
│   │       └── 🌗 theme-toggle.tsx     # Light/dark mode toggle
│   └── 📚 lib/                         # Utility libraries and configurations
│       ├── 🤖 ai/                      # AI service integrations
│       │   ├── ⚡ groq.ts              # Groq API configuration
│       │   └── 🤝 together.ts          # Together.ai API configuration
│       ├── 🔐 auth/                    # Authentication utilities
│       │   └── 🎭 AuthContext.tsx      # Authentication context provider
│       ├── 🗄️ db/                      # Database configuration
│       │   ├── 🔗 index.ts             # Database connection setup
│       │   └── 📋 schema.ts            # Database schema definitions
│       ├── ⚙️ services/                # Business logic services
│       │   └── 💬 chatService.ts       # Chat-related business logic
│       ├── 💾 storage/                 # Storage utilities
│       │   └── 📦 localStorage.ts      # Local storage management
│       ├── ☁️ supabase/                # Supabase configuration
│       │   └── 🔌 client.ts            # Supabase client setup
│       ├── ⚡ trpc/                    # tRPC configuration
│       │   ├── 🔌 client.ts            # tRPC client setup
│       │   ├── 🚀 init.ts              # tRPC initialization
│       │   ├── 🎭 provider.tsx         # tRPC React provider
│       │   ├── 🌐 root.ts              # Root router configuration
│       │   └── 🛣️ routers/             # API route definitions
│       │       ├── 🤖 ai.ts            # AI-related API routes
│       │       ├── 💬 chat.ts          # Chat-related API routes
│       │       └── 👤 user.ts          # User-related API routes
│       └── 🛠️ utils.ts                 # General utility functions
├── 🗃️ drizzle/                         # Database migrations and metadata
├── 🖼️ public/                          # Static assets (icons, images)
├── ⚙️ components.json                  # Shadcn/ui configuration
├── 🐲 drizzle.config.ts               # Drizzle ORM configuration
├── ⚙️ next.config.ts                  # Next.js configuration
├── 📦 package.json                    # Project dependencies and scripts
├── 🎨 postcss.config.mjs              # PostCSS configuration
├── 🎨 tailwind.config.js              # Tailwind CSS configuration
└── 📝 tsconfig.json                   # TypeScript configuration
```

## 🛠️ Technology Stack

### **Frontend Technologies**
- **Next.js 15** - React framework with App Router for server-side rendering and routing
- **React 19** - Modern React with latest features for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Shadcn/ui** - High-quality React components built on Radix UI primitives

### **Backend Technologies**
- **tRPC** - End-to-end typesafe APIs with automatic type inference
- **Drizzle ORM** - TypeScript ORM for database operations and migrations
- **PostgreSQL** - Production database for data persistence
- **Supabase** - Backend-as-a-Service for authentication and database hosting

### **AI Integration**
- **Together.ai** - AI model serving platform for natural language processing
- **Groq** - Alternative AI provider for fast inference (configurable)
- **React Markdown** - Markdown rendering for formatted AI responses

### **State Management & Data Fetching**
- **TanStack Query** - Powerful data synchronization for React applications
- **React Context** - Built-in state management for authentication and themes
- **Local Storage** - Client-side storage for guest user sessions

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Vercel** - Deployment platform with automatic CI/CD

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- AI API key (Together.ai or Groq)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muntajir11/Oration-AI-Career-Counselor-Chat.git
   cd careercounselor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="your_postgresql_connection_string"
   
   # AI API Configuration
   TOGETHER_API_KEY="your_together_ai_api_key"
   GROQ_API_KEY="your_groq_api_key"
   
   # Supabase Configuration (for authentication)
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

4. **Database setup**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Access the application at [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication (Test Mode)

The application is currently in test mode. For testing purposes, use the following credentials:

### **Google OAuth Test Account**
- **Email**: `Testmailcc64@gmail.com`
- **Password**: `Testmailpass`

### **Manual Registration**
You can also create a new account using any email address through the signup form.

## 📱 Features

### **Core Functionality**
- ✅ AI-powered career counseling chat interface
- ✅ Session-based conversation management
- ✅ User authentication with Google OAuth
- ✅ Persistent message history
- ✅ Real-time message streaming
- ✅ Responsive design for all devices
- ✅ Light/dark theme support
- ✅ Markdown rendering for formatted responses

### **User Experience**
- ✅ Intuitive chat interface with typing indicators
- ✅ Session sidebar for easy navigation
- ✅ Welcome screen with feature highlights
- ✅ Professional UI with smooth animations
- ✅ Mobile-optimized responsive layout

### **Technical Features**
- ✅ Type-safe API with automatic inference
- ✅ Optimistic UI updates
- ✅ Efficient data caching and synchronization
- ✅ Error handling and loading states
- ✅ SEO-optimized with proper metadata

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint code analysis
npm run db:generate  # Generate database migrations
npm run db:migrate   # Apply database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🎯 Usage Guide

### **Starting a New Conversation**
1. Navigate to the home page
2. Click "New Chat" in the sidebar
3. Begin typing your career-related question
4. Receive AI-powered guidance and advice

### **Career Topics You Can Explore**
- 💼 Career planning and transition strategies
- 📝 Resume writing and optimization
- 🎯 Interview preparation and tips
- 📈 Skill development recommendations
- 🏢 Industry insights and market trends
- 💰 Salary negotiation strategies
- ⚖️ Work-life balance guidance
- 🎓 Educational and certification advice

### **Managing Your Sessions**
- View all past conversations in the sidebar
- Click any session to continue the conversation
- Sessions are automatically saved as you chat
- Authenticated users have persistent storage across devices

## 🔮 Future Enhancements

### **Short-term Roadmap (Next 3 months)**
- [ ] **Advanced AI Models**: Integration with GPT-4 and Claude for enhanced responses
- [ ] **Voice Chat**: Voice input and audio response capabilities
- [ ] **Document Upload**: Resume analysis and feedback functionality
- [ ] **Chat Export**: Export conversations as PDF or Word documents
- [ ] **Session Sharing**: Share specific conversations with mentors or peers

### **Medium-term Goals (3-6 months)**
- [ ] **Career Assessment Tools**: Integrated personality and skills assessments
- [ ] **Job Market Integration**: Real-time job posting analysis and recommendations
- [ ] **Video Conferencing**: Integration with video call platforms for live counseling
- [ ] **Progress Tracking**: Career goal setting and milestone tracking
- [ ] **Resource Library**: Curated articles, videos, and learning materials

### **Long-term Vision (6-12 months)**
- [ ] **Multi-language Support**: Internationalization for global users
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **AI Mentor Personas**: Specialized AI counselors for different industries
- [ ] **Community Features**: User forums and peer-to-peer mentoring
- [ ] **Integration Ecosystem**: Connect with LinkedIn, job boards, and learning platforms
- [ ] **Analytics Dashboard**: Personal career development analytics and insights

### **Advanced Features**
- [ ] **Calendar Integration**: Schedule follow-up sessions and reminders
- [ ] **Smart Notifications**: Personalized career tips and industry updates
- [ ] **API Access**: Public API for third-party integrations
- [ ] **White-label Solution**: Customizable platform for organizations
- [ ] **Offline Mode**: Basic functionality without internet connection

## 🤝 Contributing

We welcome contributions to improve Career Counselor AI! Please feel free to submit issues, feature requests, or pull requests.


## 📧 Support

For support, questions, or feedback, please open an issue on GitHub or contact me.

**Built with ❤️ for career development and professional growth**
