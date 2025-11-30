/**
 * RAG API Route
 * Proxy endpoint for client-side RAG queries
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryRAG, RAGStoreId, RAG_STORES } from '@/lib/rag';

interface RAGRequestBody {
  query: string;
  storeId: RAGStoreId;
}

export async function POST(request: NextRequest) {
  try {
    const body: RAGRequestBody = await request.json();

    if (!body.query || !body.storeId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, storeId' },
        { status: 400 }
      );
    }

    // Validate store ID
    const validStoreIds = Object.values(RAG_STORES);
    if (!validStoreIds.includes(body.storeId)) {
      return NextResponse.json(
        { error: 'Invalid store ID' },
        { status: 400 }
      );
    }

    // Query RAG
    const result = await queryRAG(body.query, body.storeId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('RAG API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    if (errorMessage.includes('Failed to set RAG store')) {
      return NextResponse.json(
        { error: 'RAG service is unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    if (errorMessage.includes('RAG query failed')) {
      return NextResponse.json(
        { error: 'Could not retrieve research. The RAG service may be experiencing issues.' },
        { status: 502 }
      );
    }


    return NextResponse.json(
      {
        error: 'An unexpected error occurred while fetching research.',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
