/**
 * Theme Provider Component
 * 
 * This component wraps the application with theme functionality using next-themes.
 * It provides light/dark mode switching capabilities and persists user preferences
 * across sessions using localStorage.
 * 
 * Features:
 * - Light and dark theme support
 * - Theme persistence in localStorage
 * - CSS class-based theme switching
 * - Smooth theme transitions
 * - Custom storage key for the application
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";

/**
 * ThemeProvider Component
 * 
 * Configures and provides theme context to the entire application.
 * Sets up theme preferences and switching behavior.
 * 
 * @param children - Child components to receive theme context
 * @param props - Additional props passed to NextThemesProvider
 * @returns Theme provider wrapper with configured settings
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      {...props}
      attribute="class" // Use CSS classes for theme switching
      defaultTheme="light" // Default to light theme
      enableSystem={false} // Disable automatic system theme detection
      storageKey="career-counselor-theme" // Custom localStorage key
      disableTransitionOnChange={false} // Enable smooth theme transitions
    >
      {children}
    </NextThemesProvider>
  );
}
