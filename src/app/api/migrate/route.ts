import { NextRequest, NextResponse } from 'next/server';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    // Check for a secret token to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.MIGRATION_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Run migrations
    await migrate(sql, { migrationsFolder: './src/db/migrations' });
    
    return NextResponse.json(
      { message: 'Database migrations completed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET method to check migration status
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if database is accessible
    await sql`SELECT 1`;
    
    return NextResponse.json(
      { message: 'Database connection successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}