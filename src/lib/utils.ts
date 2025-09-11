/**
 * Utility Functions
 * 
 * This module provides common utility functions used throughout the application.
 * Currently includes class name merging functionality for Tailwind CSS.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Class Name Utility Function
 * 
 * Combines and optimizes Tailwind CSS class names using clsx and tailwind-merge.
 * This function handles conditional classes and removes conflicting Tailwind classes.
 * 
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Optimized class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
