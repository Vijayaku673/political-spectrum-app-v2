import { NextResponse } from 'next/server';
import { getHeadlinesForFrontend } from '@/lib/news-fetcher';

/**
 * Headlines API - NO AI REQUIRED
 * 
 * Fetches REAL headlines from RSS feeds and stores them in the database.
 * This is the PRIMARY method for loading articles - works completely locally.
 * 
 * Flow:
 * 1. Fetch from RSS feeds (NYT, Fox, NPR, etc.)
 * 2. Store ALL articles in database
 * 3. Return formatted headlines for frontend
 * 
 * AI is NOT used here - articles are real news from real sources.
 */
export async function GET() {
  try {
    console.log('[Headlines] Fetching real headlines from RSS feeds...');
    
    const result = await getHeadlinesForFrontend();
    
    console.log(`[Headlines] Successfully fetched ${result.leftHeadlines.length + result.centerHeadlines.length + result.rightHeadlines.length} headlines`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Headlines] Error fetching headlines:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch headlines', 
        details: error instanceof Error ? error.message : 'Unknown error',
        leftHeadlines: [],
        centerHeadlines: [],
        rightHeadlines: [],
      },
      { status: 500 }
    );
  }
}
