import { NextResponse } from 'next/server';
import { fetchHeadlinesFromRSS } from '@/lib/news-fetcher';

/**
 * Ticker API - NO AI REQUIRED
 * 
 * Fetches breaking news headlines from RSS feeds for the news ticker.
 * Uses the same RSS feed system as the headlines API.
 */

export async function GET() {
  try {
    // Fetch headlines from RSS feeds
    const headlines = await fetchHeadlinesFromRSS();
    
    // Combine all headlines and shuffle for ticker
    const allHeadlines = [
      ...headlines.left,
      ...headlines.center,
      ...headlines.right,
    ];
    
    // Shuffle the array for variety
    const shuffled = allHeadlines.sort(() => Math.random() - 0.5);
    
    // Format for ticker (top 10)
    const tickerHeadlines = shuffled.slice(0, 10).map(h => ({
      headline: h.title,
      source: h.source,
      url: h.url,
      emoji: '⚡️',
      publishedAt: h.publishedAt.toISOString(),
    }));
    
    return NextResponse.json({
      headlines: tickerHeadlines,
      provider: 'RSS Feeds',
      model: 'Real News Aggregator v2.0',
    });
  } catch (error) {
    console.error('Error fetching ticker headlines:', error);
    
    // Return empty array instead of error - ticker will just be empty
    return NextResponse.json({
      headlines: [],
      provider: 'RSS Feeds',
      error: 'Could not fetch headlines',
    });
  }
}
