import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Archive API - Save articles for later reading
 * 
 * POST /api/archive - Archive an article
 * GET /api/archive - Get archived articles
 * DELETE /api/archive?id=xxx - Remove from archive
 */

// Archive an article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      articleId, 
      title, 
      url, 
      source, 
      content, 
      spectrumScore, 
      evidence, 
      tags, 
      outletBias, 
      articleDelta, 
      finalBias,
      signals,
      publishedAt
    } = body;
    
    if (!articleId && !url) {
      return NextResponse.json(
        { error: 'Missing required fields: articleId or url' },
        { status: 400 }
      );
    }

    const id = articleId || crypto.randomUUID();

    // Check if already archived
    const existing = await db.article.findFirst({
      where: { id }
    });

    if (existing?.isArchived) {
      return NextResponse.json({
        archived: true,
        message: 'Article already archived',
        article: existing
      });
    }

    // Update or create the article
    const articleData = {
      id,
      title: title || existing?.title || '',
      url: url,
      source: source || existing?.source || '',
      publishedAt: publishedAt ? new Date(publishedAt) : (existing?.publishedAt || new Date()),
      spectrumScore: spectrumScore ?? existing?.spectrumScore,
      fullContent: content || null,
      spectrumJustification: generateJustification(outletBias, articleDelta, finalBias, tags),
      outletBias: outletBias ?? existing?.outletBias,
      articleDelta: articleDelta ?? existing?.articleDelta,
      evidence: evidence ? JSON.stringify(evidence) : existing?.evidence,
      tags: tags ? JSON.stringify(tags) : existing?.tags,
      confidence: 0.8,
      analysisMethod: 'algorithm',
      aiProvider: 'archive',
      updatedAt: new Date(),
      isArchived: true,
    };

    
    if (existing) {
      await db.article.update({
        where: { id },
        data: articleData,
      });
    } else {
      await db.article.create({
        data: articleData
      });
    }

    console.log(`[Archive] Saved article: ${title}`);

    const responseArticle = {
      ...articleData,
      evidence: evidence,
      tags
    };
    
    return NextResponse.json({
      archived: true,
      message: 'Article archived successfully',
      article: responseArticle
    });
  } catch (error) {
    console.error('[Archive] Error:', error);
    return NextResponse.json(
      { error: 'Failed to archive article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Get archived articles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const articles = await db.article.findMany({
      where: { isArchived: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.article.count({
      where: { isArchived: true }
    });

    // Parse JSON fields
    const parsedArticles = articles.map(a => ({
      ...a,
      evidence: a.evidence ? JSON.parse(a.evidence as string) : null,
      tags: a.tags ? JSON.parse(a.tags as string) : []
    }));

    return NextResponse.json({
      articles: parsedArticles,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('[Archive] Error fetching:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archived articles' },
      { status: 500 }
    );
  }
}

/**
 * Remove from archive (unarchive)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing article id' },
        { status: 400 }
      );
    }

    await db.article.update({
      where: { id },
      data: { 
        isArchived: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      unarchived: true,
      message: 'Article removed from archive'
    });
  } catch (error) {
    console.error('[Archive] Error deleting:', error);
    return NextResponse.json(
      { error: 'Failed to unarchive article' },
      { status: 500 }
    );
  }
}

/**
 * Generate justification text
 */
function generateJustification(
  outletBias: number | null | undefined,
  articleDelta: number | null | undefined,
  finalBias: number | null | undefined,
  tags: string[] | null | undefined
): string {
  const getBiasLabel = (score: number): string => {
    if (score <= -2) return 'Far Left';
    if (score <= -0.5) return 'Left';
    if (score < 0.5) return 'Center';
    if (score < 2) return 'Right';
    return 'Far Right';
  };

  return `Outlet baseline: ${getBiasLabel(outletBias || 0)}. Article framing deviation: ${(articleDelta || 0)?.toFixed(2)}. Final score: ${(finalBias || 0)?.toFixed(2)} (${getBiasLabel(finalBias || 0)}). Tags: ${(tags || []).join(', ')}`;
}
