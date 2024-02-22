import { ITADApiCallType, ITADApiCallParams, ITADApiCallBody, ITADApiResponse, ITAD_SEARCH_SUFFIXES, ITAD_BASE_URL, ITAD_API_KEY } from '../models/gameModel';

interface fetchITADOpts<CallType extends ITADApiCallType> {
    params?: ITADApiCallParams<CallType>;
    body?: ITADApiCallBody<CallType>;
}
export async function fetchITAD<CallType extends ITADApiCallType>(callType: CallType, { params, body }: fetchITADOpts<CallType>): Promise<ITADApiResponse<CallType>> {
    const _params = params ?? {};
    _params!['key'] = ITAD_API_KEY;
    const urly = new URL(ITAD_SEARCH_SUFFIXES[callType], ITAD_BASE_URL);
    Object.entries(_params as ITADApiCallParams<CallType>).forEach(([key, value]) => {
        if (value === undefined) return;
        const _value = value instanceof Array ? value.join(',') : value;
        urly.searchParams.append(key, _value as string);
    });
    return await fetch(urly, body ? { method: "POST", body: JSON.stringify(body) } : {});
}

export async function getSearchResultsItad(query: string) {
    const params = {
        title: query,
        results: '10',
    };
    try {
        const response = await fetchITAD('search', { params });
        const res = await response.json();
        return res;
    } catch (err) {
        console.error("error in get multiple game: ", err);
        return;
    }
}

export async function getGamePricesItad(gameId: string, shops: number[]) {
    const params = { shops };
    const body = [gameId];
    try {
        const response = await fetchITAD('prices', { params, body });
        const res = await response.json();
        return res[0] ?? null; //return null specifically for no results and undefined on error
    } catch (err) {
        console.error("error in get game price: ", err);
        return;
    }
}

export async function getGameHistoricalLowsItad(gameId: string, shops: number[]) {
    const params = { shops };
    const body = [gameId];
    try {
        const response = await fetchITAD('lowest', { params, body });
        const res = await response.json();
        return res[0] ?? null; //return null specifically for no results and undefined on error
    } catch (err) {
        console.error("error in get game historical low: ", err);
        return;
    }
}