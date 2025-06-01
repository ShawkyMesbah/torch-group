import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'UPLOADTHING_SECRET',
      'RESEND_API_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        },
        { status: 500 }
      );
    }

    // Check database migrations
    const migrationStatus = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 1
    `;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '0.1.0',
        lastMigration: migrationStatus[0] || null,
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 