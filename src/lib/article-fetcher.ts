/**
 * Article Content Fetcher
 * 
 * Fetches and extracts article content from URLs.
 * Works WITHOUT any external AI dependencies.
 * 
 * Uses native fetch + cheerio for HTML parsing.
 */

import * as cheerio from 'cheerio';

export interface ArticleContent {
  title: string;
  content: string;
  author?: string;
  publishedDate?: string;
  imageUrl?: string;
  description?: string;
  siteName?: string;
  isPaywalled: boolean;
  error?: string;
}

// User agents to try if one fails
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

// Known paywalled domains
const PAYWALLED_DOMAINS = [
  'nytimes.com',
  'washingtonpost.com',
  'wsj.com',
  'ft.com',
  'theatlantic.com',
  'newyorker.com',
  'economist.com',
  'bloomberg.com',
  'wired.com',
  'technologyreview.com',
];

/**
 * Check if a domain is known to be paywalled
 */
function isPaywalledDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return PAYWALLED_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Extract main content from HTML
 */
function extractContent(html: string, url: string): ArticleContent {
  const $ = cheerio.load(html);
  
  // Remove unwanted elements
  $('script, style, nav, header, footer, aside, .advertisement, .ad, .social-share, .comments, .related-articles').remove();
  
  // Extract title
  let title = '';
  title = $('meta[property="og:title"]').attr('content') || 
          $('meta[name="twitter:title"]').attr('content') ||
          $('h1').first().text().trim() ||
          $('title').text().trim();
  
  // Extract author
  const author = $('meta[name="author"]').attr('content') ||
                 $('meta[property="article:author"]').attr('content') ||
                 $('[rel="author"]').text().trim() ||
                 $('.author-name, .byline-name, .author').first().text().trim();
  
  // Extract publish date
  const publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                        $('meta[name="date"]').attr('content') ||
                        $('time[datetime]').attr('datetime') ||
                        $('time').first().text().trim();
  
  // Extract image
  const imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   $('article img').first().attr('src');
  
  // Extract description
  const description = $('meta[property="og:description"]').attr('content') ||
                      $('meta[name="description"]').attr('content');
  
  // Extract site name
  const siteName = $('meta[property="og:site_name"]').attr('content') ||
                   $('meta[name="application-name"]').attr('content');
  
  // Extract main content - try multiple selectors
  let content = '';
  
  // Try article tag first
  const articleSelectors = [
    'article',
    '[role="article"]',
    '.article-body',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.story-content',
    '.main-content',
    '#article-body',
    '#content',
    'main',
  ];
  
  for (const selector of articleSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      // Get all paragraphs
      const paragraphs: string[] = [];
      element.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) { // Only include substantial paragraphs
          paragraphs.push(text);
        }
      });
      
      if (paragraphs.length > 2) {
        content = paragraphs.join('\n\n');
        break;
      }
    }
  }
  
  // Fallback: get all paragraphs
  if (!content) {
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) {
        paragraphs.push(text);
      }
    });
    content = paragraphs.slice(0, 20).join('\n\n'); // Limit to first 20 paragraphs
  }
  
  // Clean up content
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  const isPaywalled = isPaywalledDomain(url);
  
  return {
    title: title.trim(),
    content,
    author: author?.trim() || undefined,
    publishedDate: publishedDate?.trim() || undefined,
    imageUrl: imageUrl?.trim() || undefined,
    description: description?.trim() || undefined,
    siteName: siteName?.trim() || undefined,
    isPaywalled,
  };
}

/**
 * Fetch article content from a URL
 */
export async function fetchArticleContent(url: string): Promise<ArticleContent> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    return {
      title: '',
      content: '',
      isPaywalled: false,
      error: 'Invalid URL',
    };
  }
  
  // Check if it's a paywalled domain
  const isPaywalled = isPaywalledDomain(url);
  
  // Try fetching with different user agents
  for (const userAgent of USER_AGENTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        continue; // Try next user agent
      }
      
      const html = await response.text();
      
      // Check for paywall indicators in HTML
      const paywallIndicators = [
        'paywall',
        'subscriber-only',
        'premium-content',
        'subscription-required',
        'sign in to continue reading',
        'subscribe to read',
        'this article is for subscribers',
      ];
      
      const htmlLower = html.toLowerCase();
      const hasPaywall = paywallIndicators.some(indicator => htmlLower.includes(indicator));
      
      const result = extractContent(html, url);
      
      // Check if we got meaningful content
      if (result.content.length < 200) {
        continue; // Try next user agent
      }
      
      return {
        ...result,
        isPaywalled: isPaywalled || hasPaywall,
      };
      
    } catch (error) {
      // Continue to next user agent
      console.log(`[ArticleFetcher] Attempt failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      continue;
    }
  }
  
  // All attempts failed
  return {
    title: '',
    content: '',
    isPaywalled,
    error: 'Failed to fetch article content. The site may be blocking automated access.',
  };
}

/**
 * Check if an article URL is accessible
 */
export async function checkArticleAccessible(url: string): Promise<{
  accessible: boolean;
  isPaywalled: boolean;
  title?: string;
}> {
  try {
    const result = await fetchArticleContent(url);
    return {
      accessible: result.content.length > 200,
      isPaywalled: result.isPaywalled,
      title: result.title,
    };
  } catch {
    return {
      accessible: false,
      isPaywalled: isPaywalledDomain(url),
    };
  }
}

export default fetchArticleContent;
