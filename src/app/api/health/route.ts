import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const sql = neon(process.env.DATABASE_URL!);
    await sql`SELECT 1`;
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV,
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      version: process.env.npm_package_version || '1.0.0'
    }, { status: 503 });
  }
}