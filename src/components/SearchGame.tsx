import { ButtonItem, TextField } from "decky-frontend-lib";
import { useState, useEffect } from "react";

const ITAD_BASE_URL = 'https://api.isthereanydeal.com';
const ITAD_SEARCH_SUFFIXES = {
    search: '/v02/search/search/',
    prices: '/v01/game/prices/',
    lowest: '/v01/game/lowest/'
}

type ITADApiCallType = 'search' | 'prices' | 'lowest';

type ITADSearchResultItem = {
    id: number,
    plain: string,
    title: string
}

type ITADLowestResultItem = {
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

type ITADCurrentPriceResultItem = {
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

interface ITADApiResponse<CallType extends ITADApiCallType> extends Response {
    json: () => Promise<
        CallType extends 'search' ? { data: { results: ITADSearchResultItem[] } } :
        CallType extends 'prices' ? { data: { [plainName: string]: { list: ITADLowestResultItem[], urls: { game: string } } } } :
        CallType extends 'lowest' ? { data: { [plainName: string]: ITADCurrentPriceResultItem } } :
        never
    >
}
    
type ITADApiCallParams<CallType extends ITADApiCallType> = 
    CallType extends 'search' ? { key: string, q: string, limit?: string, strict?: string } :
    CallType extends 'prices' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, added?: string } :
    CallType extends 'lowest' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, since?: string, until?: string, new?: string } :
    never;

type GameData = {
    id: string | number,
    title: string,
    currentPrice: string | number,
    originalPrice: string | number,
    originalCut: string | number,
    lowestPrice: string | number,
    lowestCut: string | number
}

async function fetchITAD<CallType extends ITADApiCallType>(callType: CallType, params: ITADApiCallParams<CallType>): Promise<ITADApiResponse<CallType>> {
    const urly = new URL(ITAD_SEARCH_SUFFIXES[callType], ITAD_BASE_URL);
    Object.entries(params).forEach(([key, value]) => urly.searchParams.append(key, value));
    return await fetch(urly);
}

const SearchGame = () => {
	const [fieldInput, setFieldInput] = useState("");
	const [gameName, setGameName] = useState("");
	const [gameSearchList, setGameSearchList] = useState<ITADSearchResultItem[]>([]);

	const [selectedGame, setSelectedGame] = useState<ITADSearchResultItem>({
		id: 0,
		plain: "",
		title: "",
	});

	const [gameData, setGameData] = useState<GameData>({
		id: 0,
		title: "",
		currentPrice: "",
		originalPrice: "",
		originalCut: "",
		lowestPrice: "",
		lowestCut: "",
	});

	const ITAD_API_KEY = "aa1c70075662a960294dd85e1dd78cd1ad4d26f7";


	async function getGameInfo(gameData: ITADSearchResultItem, shop: string) {
		try {
			const shopName = shop;

			const currentPriceData = await getPrice(gameData.plain, shopName);
			const historicalLowData = await getHistoricalLow(
				gameData.plain,
				shopName
			);

			return {
				id: gameData.id,
				title: gameData.title,
				currentPrice: currentPriceData!.newPrice,
				originalPrice: currentPriceData!.originalPrice,
				originalCut: currentPriceData!.percentageCut,
				lowestPrice: historicalLowData!.lowestPrice,
				lowestCut: historicalLowData!.percentageCut,
			};
		} catch (err) {
			console.error("error in get game info: ", err);
		}
		return null;
	}

	async function getSearchResults(query: string) {
		const params = {
            key: ITAD_API_KEY,
		    q: query,
		    limit: '10',
		    strict: '0'
        }
		try{
			const response = await fetchITAD('search', params);
			const res = await response.json();
			return res?.data?.results;
		} catch (err) {
			console.error("error in get multiple game: ", err);
		}
		return null;
	}

	async function getPrice(game: string, shop: string) {
		const params = {
            key: ITAD_API_KEY,
            plains: game,
            shops: shop
        }

		try{
			const response = await fetchITAD('prices', params);
			const res = await response.json();
			const [newPrice, originalPrice, percentageCut] = [
				res.data[game].list[0]?.price_new,
				res.data[game].list[0]?.price_old,
				res.data[game].list[0]?.price_cut,
			];
			return { newPrice, originalPrice, percentageCut };
		} catch (err) {
			console.error("error in get game price: ", err);
		}
		return null;
	}

	async function getHistoricalLow(game: string, shop: string) {
        const params = {
            key: ITAD_API_KEY,
            plains: game,
            shops: shop
        }
	
		try{
			const response = await fetchITAD('lowest', params);
			const res = await response.json();
			const [lowestPrice, percentageCut] = [
				res.data[game]?.price,
				res.data[game]?.cut,
			];
			return { lowestPrice, percentageCut };
		} catch (err) {
			console.error("error in get game historical low: ", err);
		}
		return null;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (gameName === "") {
					setGameSearchList([]);
					return;
				}
				const searchResults = await getSearchResults(gameName);
				setGameSearchList(searchResults!);
				setSelectedGame({
					id: 0,
					title: "",
					plain: "",
				});
				setGameData({ 
					id: "",
					title: "",
					currentPrice: "",
					originalPrice: "",
					originalCut: "",
					lowestPrice: "",
					lowestCut: "",
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [gameName]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (selectedGame.title === "") {
					return;
				}
				const singleGameInfo = await getGameInfo(selectedGame, "steam");

				const {
					id,
					title,
					currentPrice,
					originalPrice,
					originalCut,
					lowestPrice,
					lowestCut,
				} = singleGameInfo!;

				setGameSearchList([]);

				setGameData({
					id,
					title,
					currentPrice,
					originalPrice,
					originalCut,
					lowestPrice,
					lowestCut,
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [selectedGame]);

	const handleInputChange = (event: any) => {
		setFieldInput(event.target.value);
		setGameName(event.target.value)
	};

	const handleReset = async () => {
		setFieldInput("");
		setGameName("");
	};

	const handleGameSelect = async (id: number, plain: string, title: string) => {
		console.log("title is: ", title, " plain is: ", plain, "id is: ", id);
		setSelectedGame({
			id: id,
			plain: plain,
			title: title,
		});
	};

	return (
		<>
			Test Section Row Component
			<p>Please search the name of the game you're looking for:</p>
			<TextField onChange={(e) => handleInputChange(e)} value={fieldInput} />
			<ButtonItem layout="below" onClick={handleReset}>
				Reset
			</ButtonItem>
			<div>
				{gameData.title !== "" ? (
					<div>
						<div>Title: {gameData.title}</div>
						<div>Id: {gameData.id}</div>
						<div>Original Price: {gameData.originalPrice}</div>
						<div>
							{gameData.currentPrice !== gameData.originalPrice ? (
								<div>
									Sale Price: {gameData.currentPrice} {"["} -
									{gameData.originalCut}% {"]"}
								</div>
							) : (
								<div>Sale Price: {gameData.title} is not currently on sale</div>
							)}
						</div>
						<div>
							{gameData.lowestPrice !== "0" ? (
								<div>
									Historical Low: {gameData.lowestPrice} {"["} -
									{gameData.lowestCut}% {"]"}
								</div>
							) : (
								<div>
									Historical Low: {gameData.title} is already at it's lowest
									price
								</div>
							)}
						</div>
					</div>
				) : (
					<div>
						{gameSearchList
							? gameSearchList.map((singleGame: ITADSearchResultItem) => (
									<div key={singleGame.id}>
										<ButtonItem
											layout="below"
											onClick={() =>
												handleGameSelect(
													singleGame.id,
													singleGame.plain,
													singleGame.title
												)
											}
										>
											{singleGame.title}
										</ButtonItem>
									</div>
							  ))
							: null}
					</div>
				)}
			</div>
		</>
	);
};

export default SearchGame;
