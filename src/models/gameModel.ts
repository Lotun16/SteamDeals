export const ITAD_BASE_URL = 'https://api.isthereanydeal.com';
export const ITAD_SEARCH_SUFFIXES = {
    search: '/games/search/v1',
    prices: '/games/prices/v2',
    lowest: '/games/storelow/v2',
}
export const ITAD_API_KEY = "4234f037e6aab44f9a5932b1f3a74be647743b0b";

export const ITAD_STORE_ID_STEAM = 61;

export type ITADApiCallType = 'search' | 'prices' | 'lowest';

export type ITADSearchResultItem = {
    id: string,
    slug: string,
    title: string,
    type: string | null,
    mature: boolean
}

type ITADPrice = {
    amount: number,
    amountInt: number,
    currency: string,
}

type ITADDeal = {
    shop: { id: number, name: string },
    price: ITADPrice,
    regular: ITADPrice,
    cut: number,
    voucher: string | null,
    storeLow: ITADPrice | null,
    historyLow: ITADPrice | null,
    flag: string | null,
    drm: { id: number, name: string }[],
    platform: { id: number, name: string }[],
    timestamp: string,
    expiry: string | null,
    url: string
}

interface ITADLow extends Pick<ITADDeal, 'shop' | 'price' | 'regular' | 'cut' | 'timestamp'> { }

export interface ITADApiResponse<CallType extends ITADApiCallType> extends Response {
    json: () => Promise<
        CallType extends 'search' ? ITADSearchResultItem[] :
        CallType extends 'prices' ? ({ id: string, deals: ITADDeal[] } | undefined)[] : //outer array is each element per game and inner array is each element per store
        CallType extends 'lowest' ? ({ id: string, lows: ITADLow[] } | undefined)[] :   //outer array is each element per game and inner array is each element per store
        never
    >
}

export type ITADApiCallParams<CallType extends ITADApiCallType> =
    CallType extends 'search' ? { title: string, results?: string } :
    CallType extends 'prices' ? { country?: string, nondeals?: boolean, vouchers?: boolean, capacity?: number, shops?: number[] } :
    CallType extends 'lowest' ? { country?: string, shops?: number[] } :
    never;

export type ITADApiCallBody<CallType extends ITADApiCallType> =
    CallType extends 'search' ? undefined :
    CallType extends 'prices' ? string[] : //array of game ids
    CallType extends 'lowest' ? string[] : //array of game ids
    never;

export type GamePriceData = {
    current: number,
    original: number,
    originalCut: number,
    lowest: number,
    lowestCut: number,
}