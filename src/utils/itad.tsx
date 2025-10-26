// Import all necessary types and constants from the game model file
import {
	ITADApiCallType,
	ITADApiCallParams,
	ITADApiCallBody,
	ITADApiResponse,
	ITAD_SEARCH_SUFFIXES,
	ITAD_BASE_URL,
	ITAD_API_KEY,
} from "../models/gameModel";

interface fetchITADOpts<CallType extends ITADApiCallType> {
	params?: ITADApiCallParams<CallType>;
	body?: ITADApiCallBody<CallType>;
}

async function fetchITAD<CallType extends ITADApiCallType>(
	callType: CallType,
	{ params, body }: fetchITADOpts<CallType>
): Promise<ITADApiResponse<CallType>> {
	const urly = new URL(ITAD_SEARCH_SUFFIXES[callType], ITAD_BASE_URL);
	urly.searchParams.append("key", ITAD_API_KEY);


	// Add parameters if they exist
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			console.log("REWQ TWO Param Key: ", key);
			console.log("REWQ Param Value: ", value);
			if (value !== undefined) {
				const stringValue = Array.isArray(value) ? value.join(",") : String(value);
				urly.searchParams.append(key, stringValue);
			}
		}
	}
	
	// Make the HTTP request - POST if body exists, GET otherwise, and return the response
	return await fetch(
		urly,
		body ? { method: "POST", body: JSON.stringify(body) } : {}
	);
}

// Function to search for games by title using the ITAD search API
export async function getSearchResultsItad(query: string) {
	const params = {
		title: query,
		results: "10",
	};
	try {
		const response = await fetchITAD("search", { params });
		const res = await response.json();
		return res;
	} catch (err) {
		console.error("error in get multiple game: ", err);
		return;
	}
}

// Function to get current prices for a specific game from specified shops
export async function getGamePricesItad(gameId: string, shops: number[]) {
	const params = { shops };
	const body = [gameId];
	
	try {
		const response = await fetchITAD("prices", { params, body });
		const res = await response.json();
		return res[0] ?? null; //return null specifically for no results and undefined on error
	} catch (err) {
		console.error("error in get game price: ", err);
		return;
	}
}

// Function to get historical lowest prices for a specific game from specified shops
export async function getGameHistoricalLowsItad(gameId: string, shops: number[]) {
	const params = { shops };
	const body = [gameId];
	try {
		const response = await fetchITAD("lowest", { params, body });
		const res = await response.json();
		return res[0] ?? null; //return null specifically for no results and undefined on error
	} catch (err) {
		console.error("error in get game historical low: ", err);
		return;
	}
}