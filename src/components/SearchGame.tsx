import { ButtonItem, DialogButton, Field, Focusable, Panel, PanelSection, PanelSectionRow, TextField, gamepadDialogClasses, quickAccessControlsClasses } from "decky-frontend-lib";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ScrollableWindow } from './ScrollableWindow';

const ITAD_BASE_URL = 'https://api.isthereanydeal.com';
const ITAD_SEARCH_SUFFIXES = {
    search: '/v02/search/search/',
    prices: '/v01/game/prices/',
    lowest: '/v01/game/lowest/',
	image: '/v01/game/info',
}

type ITADApiCallType = 'search' | 'prices' | 'lowest' | 'image';

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

type ITADImageResultItem = {
	title: string,
	image: string,
}

interface ITADApiResponse<CallType extends ITADApiCallType> extends Response {
    json: () => Promise<
        CallType extends 'search' ? { data: { results: ITADSearchResultItem[] } } :
        CallType extends 'prices' ? { data: { [plainName: string]: { list: ITADLowestResultItem[], urls: { game: string } } } } :
        CallType extends 'lowest' ? { data: { [plainName: string]: ITADCurrentPriceResultItem } } :
        CallType extends 'image' ? { data: { [plainName: string]: ITADImageResultItem } } :
        never
    >
}
    
type ITADApiCallParams<CallType extends ITADApiCallType> = 
    CallType extends 'search' ? { key: string, q: string, limit?: string, strict?: string } :
    CallType extends 'prices' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, added?: string } :
    CallType extends 'lowest' ? { key: string, plains: string, region?: string, country?: string, shops?: string, exclude?: string, since?: string, until?: string, new?: string } :
    CallType extends 'image' ? { key: string, plains: string } :
    never;

type GameData = {
    id: string | number,
    title: string,
    currentPrice: string | number,
    originalPrice: string | number,
    originalCut: string | number,
    lowestPrice: string | number,
    lowestCut: string | number,
	imageURL: string
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
    const [fixedDivHeight, setFixedDivHeight] = useState(0);

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
		imageURL: ""
	});

	const ITAD_API_KEY = "aa1c70075662a960294dd85e1dd78cd1ad4d26f7";
    const fixedDivRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (fixedDivRef.current) setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }, []);

	async function getGameInfo(gameData: ITADSearchResultItem, shop: string) {
		try {
			const shopName = shop;

			const currentPriceData = await getPrice(gameData.plain, shopName);
			const historicalLowData = await getHistoricalLow(gameData.plain, shopName);
			const imageData = await getImage(gameData.plain)

			console.log('image url: ', imageData);

			return {
				id: gameData.id,
				title: gameData.title,
				currentPrice: currentPriceData!.newPrice,
				originalPrice: currentPriceData!.originalPrice,
				originalCut: currentPriceData!.percentageCut,
				lowestPrice: historicalLowData!.lowestPrice,
				lowestCut: historicalLowData!.percentageCut,
				imageURL: imageData!
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

	async function getImage(game: string) {
		const params = {
            key: ITAD_API_KEY,
            plains: game,
        }

		try{
			const response = await fetchITAD('image', params);
			const res = await response.json();
			return res.data[game]?.image;
		} catch (err) {
			console.error("error in get game image: ", err);
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

				console.log('search results: ', searchResults);
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
					imageURL: ""
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
					imageURL
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
					imageURL
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
		console.log("title is: ", title, "| plain is: ", plain, "| id is: ", id);
		setSelectedGame({
			id: id,
			plain: plain,
			title: title,
		});
	};

    return (
        <>
            <style>{`
            .search-game-container .${gamepadDialogClasses.FieldDescription} {
                margin: 0;
            }
            .search-game-container .${quickAccessControlsClasses.PanelSectionRow}>:first-child {
                padding: 0 16px;
            }
            `}</style>
            <div className='search-game-container' style={{ position: 'absolute', width: '100%', top: 'var(--basicui-header-height)', bottom: 'var(--gamepadui-current-footer-height)' }}>
                <div ref={fixedDivRef}>
                    <h1 style={{ margin: 0, padding: '15px 20px 5px' }}> {/* margin needs to be 0 for the height calculation to be correct */}
                        Lowest Deal Search
                    </h1>
                    <Field description={
                        <Focusable style={{ display: "flex", flexDirection: "row", gap: '10px', padding: '0 16px' }}>
                            <div style={{ width: "100%" }}>

                                <TextField placeholder='Search Game' onChange={(e) => handleInputChange(e)} value={fieldInput} />
                            </div>
                            <DialogButton style={{ width: '100px', minWidth: '100px' }} onClick={handleReset}>
                                Reset
                            </DialogButton>
                        </Focusable>}
                    />
                </div>
                <ScrollableWindow fadeAmount='12px' height={`calc(100% - ${fixedDivHeight}px)`} scrollBarWidth='0px'>
                    <PanelSectionRow>
                        <div style={{ marginBottom: '50px' }}>
                            {gameData.title !== "" ? (
                                <div style={{ display: "flex", flexBasis: 2, padding: '20px 8px' }}>
                                    <div>
                                        <img src={gameData.imageURL} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                                        <h1>{gameData.title}</h1>
                                        <div>ID: {gameData.id}</div>
                                        <div>Original Price: {gameData.originalPrice}</div>
                                        <div>
                                            {gameData.currentPrice !== gameData.originalPrice ? (
                                                <div>
                                                    Sale Price: {gameData.currentPrice} {"["} - {gameData.originalCut}% {"]"}
                                                </div>
                                            ) : (
                                                <div>Sale Price: {gameData.title} is not currently on sale</div>
                                            )}
                                        </div>
                                        <div>
                                            {(gameData.lowestPrice !== "0" && gameData.lowestPrice !== 0) ? (
                                                <div>
                                                    Historical Low: {gameData.lowestPrice} {"["} - {gameData.lowestCut}% {"]"}
                                                </div>
                                            ) : (
                                                <div>
                                                    Historical Low: {gameData.title} is already at it's lowest price
                                                </div>
                                            )}
                                        </div>
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
                    </PanelSectionRow>
                </ScrollableWindow>
            </div>
        </>
    );
};

export default SearchGame;
