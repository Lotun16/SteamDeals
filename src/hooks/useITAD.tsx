import { useState, useEffect, useCallback } from "react";
import { getSearchResultsItad, getGamePricesItad, getGameHistoricalLowsItad } from "../utils/itad";

// Internal generic hook (not exported)
function useItadApi<T>(apiFunction: () => Promise<T>, enabled: boolean = true) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        if (!enabled) {
            // console.log('🚫 API call skipped - not enabled');
            setData(null);
            return;
        }
        
        // console.log('🚀 Starting API call...');
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiFunction();
            // console.log('✅ API call successful:', result);
            setData(result);
        } catch (err) {
            // console.log('❌ API call failed:', err);
            setError(err instanceof Error ? err.message : 'API call failed');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [apiFunction, enabled]);

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
}

// Public hooks (exported)
export function useItadSearch(query: string) {
    const apiFunction = useCallback(() => getSearchResultsItad(query), [query]);
    return useItadApi(apiFunction, !!query.trim());
}

export function useItadPrices(gameId: string, shops: number[]) {
    const apiFunction = useCallback(() => getGamePricesItad(gameId, shops), [gameId, shops]);
    return useItadApi(apiFunction, !!gameId && shops.length > 0);
}

export function useItadHistoricalLows(gameId: string, shops: number[]) {
    const apiFunction = useCallback(() => getGameHistoricalLowsItad(gameId, shops), [gameId, shops]);
    return useItadApi(apiFunction, !!gameId && shops.length > 0);
}