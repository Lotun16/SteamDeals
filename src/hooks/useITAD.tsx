import { useState, useEffect, useCallback } from "react";
import { getSearchResultsItad, getGamePricesItad, getGameHistoricalLowsItad } from "../utils/itad";

// Internal generic hook (not exported)
function useItadApi<T>(apiFunction: () => Promise<T>, enabled: boolean = true) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        if (!enabled) {
            setData(null);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiFunction();
            setData(result);
        } catch (err) {
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
    return useItadApi(
        () => getSearchResultsItad(query),
        !!query.trim()
    );
}

export function useItadPrices(gameId: string, shops: number[]) {
    return useItadApi(
        () => getGamePricesItad(gameId, shops),
        !!gameId && shops.length > 0
    );
}

export function useItadHistoricalLows(gameId: string, shops: number[]) {
    return useItadApi(
        () => getGameHistoricalLowsItad(gameId, shops),
        !!gameId && shops.length > 0
    );
}