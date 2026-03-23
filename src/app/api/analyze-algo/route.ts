import { NextRequest, NextResponse } from 'next/server';
import analyzeArticle, { type BiasAnalysisResult, type HeadlineData } from '@/lib/bias-engine';
import { db } from '@/lib/db';

/**
 * Algorithm Analysis API - PRIMARY METHOD
 * 
 * This endpoint provides algorithm-based bias analysis.
 * NO API KEYS REQUIRED - Works 100% locally.
 * 
 * Flow:
 * 1. Article is stored in database (if not exists)
 * 2. Algorithm analyzes the article
 * 3. Analysis results are stored and returned
 * 
 * This is the DEFAULT analysis method.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HeadlineData;
    const { headline, source, url, content, publishedAt } = body;

    if (!headline || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: headline, source' },
        { status: 400 }
      );
    }

    console.log(`[Algorithm] Analyzing: "${headline}" from ${source}`);

    // Check if article already analyzed with algorithm
    const existingArticle = await db.article.findFirst({
      where: {
        title: headline,
        source: source,
        aiProvider: 'algorithm',
      },
    });

    // Run algorithm analysis (ALWAYS works, no AI needed)
    const analysis = analyzeArticle({
      headline,
      source,
      url: url || '',
      content,
      publishedAt,
    });

    console.log(`[Algorithm] Analysis complete. Bias: ${analysis.finalBias.toFixed(2)}, Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);

    // Store/update in database - THIS ALWAYS HAPPENS
    const articleData = {
      id: existingArticle?.id || crypto.randomUUID(),
      title: headline,
      url: url || '',
      source: source,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      category: analysis.evidence.topics[0] || 'Politics',
      spectrumScore: analysis.finalBias * 3.33, // Convert -3 to +3 scale to -10 to +10
      popularityScore: 'Medium',
      leftWingSummary: analysis.evidence.framingTerms
        .filter(t => t.leaning === 'left')
        .map(t => t.term)
        .slice(0, 3)
        .join(', ') || 'No specific left-framing detected',
      rightWingSummary: analysis.evidence.framingTerms
        .filter(t => t.leaning === 'right')
        .map(t => t.term)
        .slice(0, 3)
        .join(', ') || 'No specific right-framing detected',
      socialistSummary: analysis.evidence.socialistMarkers.join(', ') || null,
      leftWingPoints: JSON.stringify(analysis.evidence.framingTerms.filter(t => t.leaning === 'left').map(t => t.term)),
      rightWingPoints: JSON.stringify(analysis.evidence.framingTerms.filter(t => t.leaning === 'right').map(t => t.term)),
      socialistPoints: JSON.stringify(analysis.evidence.socialistMarkers),
      spectrumJustification: `Outlet baseline: ${analysis.outletLabel}. Article framing deviation: ${analysis.articleDelta > 0 ? '+' : ''}${analysis.articleDelta.toFixed(2)}. Tags: ${analysis.tags.join(', ')}`,
      outletBias: analysis.outletBias,
      articleDelta: analysis.articleDelta,
      evidence: JSON.stringify(analysis.evidence),
      tags: JSON.stringify(analysis.tags),
      confidence: analysis.confidence,
      analysisMethod: 'algorithm',
      wasEdited: false,
      aiProvider: 'algorithm',
      updatedAt: new Date(),
    };

    try {
      if (existingArticle) {
        await db.article.update({
          where: { id: existingArticle.id },
          data: articleData,
        });
      } else {
        await db.article.create({
          data: articleData,
        });
      }
      console.log(`[Algorithm] Article stored in database`);
    } catch (dbError) {
      console.error('[Algorithm] Database error:', dbError);
      // Continue without storing - analysis still works
    }

    // Format response for frontend compatibility
    const response = {
      topic: headline,
      article: {
        title: headline,
        url: url || '',
        source: source,
        publishedAt: publishedAt || new Date().toISOString(),
      },
      // Algorithm-specific fields
      ...analysis,
      // Compatibility with old format
      category: analysis.evidence.topics[0] || 'Politics',
      popularity: {
        score: 'Medium',
        justification: 'Based on outlet traffic and topic relevance.',
      },
      wasEdited: {
        status: false,
        reasoning: 'Algorithm analysis does not detect edit status.',
      },
      leftWingPerspective: {
        summary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'left')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific left-framing terms detected.',
        talkingPoints: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'left')
          .map(t => t.term)
          .slice(0, 5) || ['No specific talking points identified.'],
      },
      rightWingPerspective: {
        summary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'right')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific right-framing terms detected.',
        talkingPoints: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'right')
          .map(t => t.term)
          .slice(0, 5) || ['No specific talking points identified.'],
      },
      socialistPerspective: {
        summary: analysis.evidence.socialistMarkers.join(', ') || 'No socialist framing detected.',
        talkingPoints: analysis.evidence.socialistMarkers.slice(0, 5) || ['No specific talking points identified.'],
      },
      spectrumScore: analysis.finalBias * 3.33, // Convert -3 to +3 scale to -10 to +10
      spectrumJustification: analysis.spectrumJustification,
      provider: 'Algorithm',
      model: 'v2.0.0 - 3-Layer Scoring Pipeline',
      cached: false,
      method: 'algorithm',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Algorithm] Error in analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
