import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAIAvailable, getProviderStatus } from '@/lib/ai-provider';
import fs from 'fs';
import path from 'path';

/**
 * System Diagnostics API - NO AI REQUIRED
 * 
 * Provides comprehensive system health checks and diagnostics.
 * Works completely locally without any external dependencies.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    version: '3.1.0',
    mode: 'independent',
  };
  
  try {
    // Database check
    if (type === 'all' || type === 'database') {
      try {
        const articleCount = await db.article.count();
        const recentArticles = await db.article.findMany({
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: { title: true, source: true, createdAt: true },
        });
        
        diagnostics.database = {
          status: 'healthy',
          articleCount,
          recentArticles,
        };
      } catch (dbError) {
        diagnostics.database = {
          status: 'error',
          error: dbError instanceof Error ? dbError.message : 'Unknown error',
        };
      }
    }
    
    // AI Provider status
    if (type === 'all' || type === 'ai') {
      diagnostics.ai = {
        available: isAIAvailable(),
        providers: getProviderStatus().map(p => ({
          id: p.id,
          name: p.name,
          active: p.active,
          configured: p.keySet,
        })),
        note: 'AI is OPTIONAL. App works 100% without AI.',
      };
    }
    
    // RSS Feeds check
    if (type === 'all' || type === 'rss') {
      diagnostics.rss = {
        status: 'available',
        sources: {
          left: ['NYT', 'Washington Post', 'HuffPost', 'MSNBC', 'Vox'],
          center: ['NPR', 'AP', 'Reuters', 'Politico', 'Axios'],
          right: ['Fox News', 'Daily Wire', 'National Review', 'Washington Times', 'Townhall'],
        },
        note: 'RSS feeds work without any API keys',
      };
    }
    
    // File system check
    if (type === 'all' || type === 'filesystem') {
      const dbPath = path.join(process.cwd(), 'db', 'custom.db');
      const envPath = path.join(process.cwd(), '.env');
      const envLocalPath = path.join(process.cwd(), '.env.local');
      
      diagnostics.filesystem = {
        database: {
          exists: fs.existsSync(dbPath),
          path: dbPath,
          size: fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0,
        },
        env: {
          exists: fs.existsSync(envPath),
          path: envPath,
        },
        envLocal: {
          exists: fs.existsSync(envLocalPath),
          path: envLocalPath,
        },
      };
    }
    
    // Memory and performance
    if (type === 'all' || type === 'system') {
      const memUsage = process.memoryUsage();
      diagnostics.system = {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: Math.round(process.uptime()),
        memory: {
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
          rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        },
      };
    }
    
    // Overall health
    const dbHealthy = (diagnostics.database as { status: string })?.status === 'healthy';
    diagnostics.overall = {
      status: dbHealthy ? 'healthy' : 'degraded',
      message: dbHealthy 
        ? 'All systems operational. No AI required for core functionality.'
        : 'Database issues detected. Check configuration.',
      independent: true,
      aiRequired: false,
    };
    
    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json({
      ...diagnostics,
      error: error instanceof Error ? error.message : 'Unknown error',
      overall: {
        status: 'error',
        message: 'Diagnostics failed',
      },
    }, { status: 500 });
  }
}
