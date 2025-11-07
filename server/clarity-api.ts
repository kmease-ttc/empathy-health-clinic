import { z } from "zod";

const CLARITY_API_TOKEN = process.env.CLARITY_API_TOKEN;
const CLARITY_PROJECT_ID = "u21s08irgz";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours (to respect 10 calls/day limit)

interface ClarityCache {
  data: any;
  timestamp: number;
}

// Cache keyed by endpoint to prevent different API calls from overwriting each other
const cacheStore: Map<string, ClarityCache> = new Map();

/**
 * Fetch data from Microsoft Clarity API with intelligent caching
 * Rate limit: 10 calls per day, so we cache for 24 hours
 */
export async function fetchClarityData(endpoint: string): Promise<any> {
  if (!CLARITY_API_TOKEN) {
    throw new Error("CLARITY_API_TOKEN environment variable not set");
  }

  const cacheKey = `clarity_${endpoint}`;
  const cached = cacheStore.get(cacheKey);
  
  // Check if cached data is still valid
  if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    console.log(`[Clarity API] Using cached data for ${endpoint} (age: ${Math.round((Date.now() - cached.timestamp) / 1000 / 60)} minutes)`);
    return cached.data;
  }

  console.log(`[Clarity API] Fetching fresh data from endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(
      `https://www.clarity.ms/api/v1/projects/${CLARITY_PROJECT_ID}/${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${CLARITY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clarity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Update cache for this specific endpoint
    cacheStore.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    console.log(`[Clarity API] Data fetched and cached successfully for ${endpoint}`);
    return data;
  } catch (error) {
    console.error('[Clarity API] Error fetching data:', error);
    throw error;
  }
}

/**
 * Get 404 errors and dead link data from Clarity
 */
export async function getClarityDeadLinks(): Promise<any> {
  try {
    // Note: Clarity's API structure may vary - this is a placeholder
    // You may need to adjust based on actual API response structure
    const data = await fetchClarityData('errors');
    return data;
  } catch (error) {
    console.error('[Clarity] Error fetching dead links:', error);
    return null;
  }
}

/**
 * Get page performance metrics from Clarity
 */
export async function getClarityPageMetrics(): Promise<any> {
  try {
    const data = await fetchClarityData('pages');
    return data;
  } catch (error) {
    console.error('[Clarity] Error fetching page metrics:', error);
    return null;
  }
}

/**
 * Force clear the cache (for testing or manual refresh)
 */
export function clearClarityCache(): void {
  cacheStore.clear();
  console.log('[Clarity API] All cache cleared');
}

/**
 * Get cache status - checks if any endpoint has cached data
 */
export function getCacheStatus(): { cached: boolean; age?: number } {
  // Check if we have any cached data
  let oldestCache: ClarityCache | null = null;
  
  for (const cache of cacheStore.values()) {
    if (!oldestCache || cache.timestamp < oldestCache.timestamp) {
      oldestCache = cache;
    }
  }
  
  if (!oldestCache) {
    return { cached: false };
  }
  
  const ageMinutes = Math.round((Date.now() - oldestCache.timestamp) / 1000 / 60);
  return {
    cached: true,
    age: ageMinutes,
  };
}
