/**
 * Database Test API Route
 * 
 * This API endpoint provides a simple database connectivity test.
 * It's used for health checks and troubleshooting database connection issues.
 * 
 * @route GET /api/test-db
 * @returns JSON response indicating database connection status
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET Handler for Database Test
 * 
 * Executes a simple query to verify database connectivity.
 * Returns success/failure status with appropriate error handling.
 * 
 * @returns NextResponse with connection status and test results
 */
export async function GET() {
  try {
    // Execute a simple test query to verify database connection
    const result = await db.execute('SELECT 1 as test');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: result 
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error('Database test failed:', error);
    
    // Return structured error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}