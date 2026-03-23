import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleContent } from '@/lib/article-fetcher';

/**
 * Content Fetch API - Fetches article content for reading
 * 
 * POST /api/content - Fetch article content from URL
 * Body: { url: string }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      );
    }

    console.log(`[Content] Fetching: ${url}`);
    
    const result = await fetchArticleContent(url);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Content] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch content', 
        details: error instanceof Error ? error.message : 'Unknown error',
        content: '',
        isPaywalled: false
      },
      { status: 500 }
    );
  }
}
