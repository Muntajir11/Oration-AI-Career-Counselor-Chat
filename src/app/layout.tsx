/**
 * Root Layout Component
 * 
 * This is the main layout component for the Career Counselor application.
 * It provides the fundamental structure and context providers for the entire application.
 * 
 * Features:
 * - Sets up global fonts (Geist Sans and Geist Mono)
 * - Configures metadata including title, description, and favicon icons
 * - Provides theme support for light/dark mode
 * - Integrates authentication context
 * - Sets up tRPC for API communication
 * - Manages user authentication state
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/provider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { UserManager } from "@/components/auth/UserManager";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Configure Geist Sans font with CSS variables for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font for code and monospace elements
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Application metadata configuration for SEO and browser optimization
export const metadata: Metadata = {
  title: "Career Counselor AI",
  description: "AI-powered career counseling chat application",
  icons: {
    // Standard favicon configurations for various browser sizes
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    // Apple touch icon for iOS devices
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    // Shortcut icon for bookmark functionality
    shortcut: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
};

/**
 * Root Layout Component
 * 
 * Wraps the entire application with necessary providers and global styling.
 * The component hierarchy ensures proper context availability throughout the app.
 * 
 * @param children - Child components to be rendered within the layout
 * @returns The complete HTML structure with all providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Theme provider enables light/dark mode functionality */}
        <ThemeProvider>
          {/* Authentication provider manages user login state */}
          <AuthProvider>
            {/* tRPC provider handles type-safe API communication */}
            <TRPCProvider>
              {/* User manager handles authentication flow and user state */}
              <UserManager />
              {/* Main application content */}
              {children}
            </TRPCProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
