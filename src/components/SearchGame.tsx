import { ButtonItem, DialogButton, Field, Focusable, PanelSectionRow, TextField, gamepadDialogClasses, quickAccessControlsClasses } from "decky-frontend-lib";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ScrollableWindow } from './ScrollableWindow';
import GameBox from "./GameBox";
import { ITAD_SEARCH_SUFFIXES, ITAD_BASE_URL, ITADApiCallParams, ITADApiResponse, ITADApiCallType, ITADSearchResultItem, GameData } from "../models/gameModel";

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
    const [showGame, setShowGame] = useState(false);

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
        setShowGame(false);
	};

	const handleReset = async () => {
		setFieldInput("");
		setGameName("");
        setShowGame(false);
	};

	const handleGameSelect = async (id: number, plain: string, title: string) => {
        setShowGame(true);
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
            .search-game-container .loadingthrobber_ContainerBackground_2ngG3 {
                background: transparent;
            }
            `}</style>
            <div className='search-game-container' style={{ position: 'absolute', width: '100%', top: 'var(--basicui-header-height)', bottom: 'var(--gamepadui-current-footer-height)' }}>
                <div ref={fixedDivRef}>
                    <h1 style={{ margin: 0, padding: '15px 20px 5px' }}> {/* margin needs to be 0 for the height calculation to be correct */}
                        Lowest Deal Search Test Models
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
                    {showGame ? (
                        gameData.title !== "" ? (
                            <div style={{ display: "flex", flexBasis: 2, padding: '20px 25px' }}>
                                <div>
                                    <img src={gameData.imageURL} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                                    <h1 style={{margin: '0px', padding: '0px'}}>{gameData.title}</h1>
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
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '150px' }} />
                            </div>
                        )
                    ) : (
                        <PanelSectionRow>
                            <div>
                                {gameSearchList
                                    ? gameSearchList.map((singleGame: ITADSearchResultItem) => (
                                        <div key={singleGame.id}>
                                            {/* <ButtonItem
                                                layout="below"
                                                onClick={() =>
                                                    handleGameSelect(
                                                        singleGame.id,
                                                        singleGame.plain,
                                                        singleGame.title
                                                    )
                                                }
                                            >
                                                <GameBox game={singleGame} />
                                            </ButtonItem> */}
											<GameBox game={singleGame} handleSelect={handleGameSelect} getInfo={getImage}/>
                                        </div>
                                    ))
                                    : null}
                            </div>
                        </PanelSectionRow>

                    )}
                </ScrollableWindow>
            </div>
        </>
    );
};

export default SearchGame;
