import { NextRequest, NextResponse } from 'next/server';
import { generateJSON, isAIAvailable } from '@/lib/ai-provider';
import { db } from '@/lib/db';

/**
 * AI Analysis API - OPTIONAL FEATURE
 * 
 * This endpoint provides OPTIONAL AI-powered analysis.
 * Requires user to configure their own API keys in Settings.
 * 
 * PRIMARY: Use /api/analyze-algo for algorithm-based analysis (no API keys needed)
 * SECONDARY: Use this endpoint for AI analysis (requires API key)
 */

interface AnalysisRequest {
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface AnalysisResult {
  category: string;
  popularity: {
    score: string;
    justification: string;
  };
  wasEdited: {
    status: boolean;
    reasoning: string;
  };
  rightWingPerspective: {
    summary: string;
    talkingPoints: string[];
  };
  leftWingPerspective: {
    summary: string;
    talkingPoints: string[];
  };
  socialistPerspective: {
    summary: string;
    talkingPoints: string[];
  };
  spectrumScore: number;
  spectrumJustification: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if AI is available
    if (!isAIAvailable()) {
      return NextResponse.json(
        { 
          error: 'AI analysis not available', 
          message: 'No AI providers configured. Please add your API key in Settings, or use the algorithm-based analysis instead.',
          useAlgorithm: true,
        },
        { status: 400 }
      );
    }

    const body = await request.json() as AnalysisRequest;
    const { headline, source, url, publishedAt } = body;

    if (!headline || !source || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: headline, source, url' },
        { status: 400 }
      );
    }

    // Check if article already has full analysis
    const existingArticle = await db.article.findFirst({
      where: {
        title: headline,
        source: source,
        leftWingSummary: { not: null },
        aiProvider: { not: 'algorithm' }, // Only return AI-analyzed articles
      },
    });

    if (existingArticle && existingArticle.leftWingSummary) {
      // Return cached analysis
      return NextResponse.json({
        topic: headline,
        article: {
          title: headline,
          url: existingArticle.url,
          source: existingArticle.source,
          publishedAt: existingArticle.publishedAt.toISOString(),
        },
        category: existingArticle.category || 'Politics',
        popularity: {
          score: existingArticle.popularityScore || 'Medium',
          justification: 'Retrieved from archive.',
        },
        wasEdited: {
          status: existingArticle.wasEdited,
          reasoning: existingArticle.editReasoning || '',
        },
        rightWingPerspective: {
          summary: existingArticle.rightWingSummary || '',
          talkingPoints: existingArticle.rightWingPoints ? JSON.parse(existingArticle.rightWingPoints) : [],
        },
        leftWingPerspective: {
          summary: existingArticle.leftWingSummary || '',
          talkingPoints: existingArticle.leftWingPoints ? JSON.parse(existingArticle.leftWingPoints) : [],
        },
        socialistPerspective: {
          summary: existingArticle.socialistSummary || '',
          talkingPoints: existingArticle.socialistPoints ? JSON.parse(existingArticle.socialistPoints) : [],
        },
        spectrumScore: existingArticle.spectrumScore || 0,
        spectrumJustification: existingArticle.spectrumJustification || '',
        provider: existingArticle.aiProvider || 'cached',
        cached: true,
        method: 'ai',
      });
    }

    // Generate new AI analysis
    const analysisPrompt = `Analyze the news article provided below.

    Article to Analyze:
    - Title: ${headline}
    - Source: ${source}
    - URL: ${url}

    Perform the following analysis and provide your response as a single, valid JSON object:

    1. **Category Tag**: Classify the article's topic into one of the following: "National News", "World News", "Politics", "Technology", "Business", "Culture", or "Local News".
    2. **Popularity Analysis**: Estimate the article's reach and popularity (score: "Low", "Medium", "High", or "Viral") and provide a brief justification for your score based on the source and topic.
    3. **Edited Status**: Analyze the content for any indications that the article was significantly edited or updated after its initial publication. Note the status (true/false) and provide reasoning, such as finding phrases like "This story has been updated".
    4. **Right-Wing Perspective**:
        - Provide a 'summary' of how a conservative or right-leaning individual would likely interpret the key information in this article.
        - List the key 'talkingPoints' they would derive from it (3-5 points).
    5. **Left-Wing Perspective**:
        - Provide a 'summary' of how a liberal or left-leaning individual would likely interpret the key information in this article.
        - List the key 'talkingPoints' they would derive from it (3-5 points).
    6. **Socialist Perspective**:
        - Provide a 'summary' of how a socialist would critique the article's framing, focusing on class, labor, capitalism, or systemic issues.
        - List the key 'talkingPoints' from this perspective (3-5 points).
    7. **Spectrum Score**: Assign a 'spectrumScore' from -10 (very liberal/left) to +10 (very conservative/right) for the article's own bias.
    8. **Spectrum Justification**: Provide a brief 'spectrumJustification' for the score.

    Respond with ONLY a valid JSON object, no markdown, no explanations.`;

    const systemPrompt = `You are an impartial political analyst. Provide balanced, objective analysis 
    of news articles from multiple political perspectives. Be fair to all viewpoints and avoid 
    introducing personal bias into your analysis.`;

    const result = await generateJSON<AnalysisResult>(analysisPrompt, systemPrompt);

    // Store the analysis in database
    const articleData = {
      id: crypto.randomUUID(),
      title: headline,
      url: url,
      source: source,
      publishedAt: new Date(publishedAt || new Date()),
      category: result.data.category,
      spectrumScore: result.data.spectrumScore,
      popularityScore: result.data.popularity.score,
      leftWingSummary: result.data.leftWingPerspective.summary,
      leftWingPoints: JSON.stringify(result.data.leftWingPerspective.talkingPoints),
      rightWingSummary: result.data.rightWingPerspective.summary,
      rightWingPoints: JSON.stringify(result.data.rightWingPerspective.talkingPoints),
      socialistSummary: result.data.socialistPerspective.summary,
      socialistPoints: JSON.stringify(result.data.socialistPerspective.talkingPoints),
      spectrumJustification: result.data.spectrumJustification,
      wasEdited: result.data.wasEdited.status,
      editReasoning: result.data.wasEdited.reasoning,
      aiProvider: result.provider,
      updatedAt: new Date(),
    };

    // Try to update existing or create new
    const existing = await db.article.findFirst({
      where: { title: headline, source: source },
    });

    if (existing) {
      await db.article.update({
        where: { id: existing.id },
        data: articleData,
      });
    } else {
      await db.article.create({
        data: articleData,
      });
    }

    return NextResponse.json({
      topic: headline,
      article: {
        title: headline,
        url: url,
        source: source,
        publishedAt: publishedAt,
      },
      ...result.data,
      provider: result.provider,
      model: result.model,
      cached: false,
      method: 'ai',
    });
  } catch (error) {
    console.error('Error analyzing article:', error);
    
    // Provide helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotConfigured = errorMessage.includes('No AI providers configured');
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze article with AI', 
        details: errorMessage,
        useAlgorithm: isNotConfigured,
        message: isNotConfigured 
          ? 'No AI providers configured. Use algorithm-based analysis instead.'
          : errorMessage,
      },
      { status: 500 }
    );
  }
}
