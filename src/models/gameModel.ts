export const ITAD_BASE_URL = 'https://api.isthereanydeal.com';
export const ITAD_SEARCH_SUFFIXES = {
    //old domains
    search: '/v02/search/search/',
    prices: '/v01/game/prices/',
    lowest: '/v01/game/lowest/',
	image: '/v01/game/info',
    //new domains
    // search: '/games/search/v1',
    // prices: '/games/prices/v2',
    // lowest: '/games/historylow/v1',
	// image: '/v01/games/info/v2',
}

export type ITADApiCallType = 'search' | 'prices' | 'lowest' | 'image';

export type ITADSearchResultItem = {
    id: number,
    plain: string,
    title: string
}

export type ITADLowestResultItem = {
    price_new: number,
    price_old: number,
    price_cut: number,
    url: string,
    shop: {
        id: string,
        name: string
    },
    drm: string[]
}

export type ITADCurrentPriceResultItem = {
    price: number,
    cut: number,
    added: number,
    shop: {
        id: string,
        name: string
    },
    urls: { 
        game: string,
        history: string
    }
}

export type ITADImageResultItem = {
	title: string,
	image: string,
}

export interface ITADApiResponse<CallType extends ITADApiCallType> extends Response {
    json: () => Promise<
        CallType extends 'search' ? { data: { results: ITADSearchResultItem[] } } :
        CallType extends 'prices' ? { data: { [plainName: string]: { list: ITADLowestResultItem[], urls: { game: string } } } } :
        CallType extends 'lowest' ? { data: { [plainName: string]: ITADCurrentPriceResultItem } } :
        CallType extends 'image' ? { data: { [plainName: string]: ITADImageResultItem } } :
        never
    >
}
    
export type ITADApiCallParams<CallType extends ITADApiCallType> = 
    CallType extends 'search' ? { key: string, q: string, limit?: string, strict?: string } :
    CallType extends 'prices' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, added?: string } :
    CallType extends 'lowest' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, since?: string, until?: string, new?: string } :
    CallType extends 'image' ? { key: string, plains: string } :
    never;

export type GameData = {
    id: string | number,
    title: string,
    currentPrice: string | number,
    originalPrice: string | number,
    originalCut: string | number,
    lowestPrice: string | number,
    lowestCut: string | number,
	imageURL: string
}