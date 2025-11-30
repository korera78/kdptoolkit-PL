/**
 * RAG (Retrieval-Augmented Generation) API Client
 * Integrates with Gemini RAG service for enhanced blog content
 */

export const RAG_STORES = {
  KDP_MARKETING: 'kdpmarketintelligence-6lv9nw7026oi',
  STYLE_GUIDE: 'autoblogstyleguide-kff0lsmrx8bt',
  AFFILIATE_PRODUCTS: 'affiliateproductsdetailed-vkrd5cdpji01',
} as const;

export type RAGStoreId = (typeof RAG_STORES)[keyof typeof RAG_STORES];

interface RAGQueryRequest {
  query: string;
}

interface RAGQueryResponse {
  answer: string;
  sources?: Array<{
    title: string;
    snippet: string;
    url?: string;
  }>;
  confidence?: number;
}

interface SetStoreRequest {
  store_id: RAGStoreId;
}

interface SetStoreResponse {
  status: string;
  current_store: string;
}

/**
 * Sets the current RAG store for subsequent queries
 * @param storeId - The ID of the RAG store to use
 * @returns Response indicating success or failure
 */
export async function setRAGStore(storeId: RAGStoreId): Promise<SetStoreResponse> {
  const apiUrl = process.env.RAG_API_URL || 'http://localhost:5002';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`${apiUrl}/api/stores/current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        store_id: storeId,
      } as SetStoreRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set RAG store: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting RAG store:', error);
    throw error;
  }
}

/**
 * Queries the currently active RAG store
 * @param query - The search query
 * @param storeId - Optional store ID to set before querying
 * @returns RAG query response with answer and sources
 */
export async function queryRAG(
  query: string,
  storeId?: RAGStoreId
): Promise<RAGQueryResponse> {
  const apiUrl = process.env.RAG_API_URL || 'http://localhost:5002';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  try {
    // Set store if specified
    if (storeId) {
      await setRAGStore(storeId);
    }

    // Query RAG
    const response = await fetch(`${apiUrl}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        query,
      } as RAGQueryRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG query failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying RAG:', error);
    throw error;
  }
}

/**
 * Client-side RAG query through Next.js API route
 * Use this from client components to avoid CORS issues
 * @param query - The search query
 * @param storeId - The RAG store to query
 * @returns RAG query response
 */
export async function queryRAGClient(
  query: string,
  storeId: RAGStoreId
): Promise<RAGQueryResponse> {
  try {
    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        storeId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG query failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying RAG (client):', error);
    throw error;
  }
}
