import {
	ButtonItem,
	TextField,
} from "decky-frontend-lib";
import { useState, useEffect } from "react";

type SearchResult = {
	id: number;
	plain: string;
	title: string;
};

const SearchGame = () => {
	const [fieldInput, setFieldInput] = useState("");

	const [gameName, setGameName] = useState("");

	const [selectedGame, setSelectedGame] = useState<SearchResult>({
		id: -1,
		plain: "",
		title: "",
	});

	const [gameSearchList, setGameSearchList] = useState<SearchResult[]>([]);

	const [gameData, setGameData] = useState({
		id: "",
		title: "",
		currentPrice: "",
		originalPrice: "",
		originalCut: "",
		lowestPrice: "",
		lowestCut: "",
	});

	const ITAD_API_KEY = "aa1c70075662a960294dd85e1dd78cd1ad4d26f7";

	const getGameURL = "https://api.isthereanydeal.com/v02/search/search/";
	const priceURL = "https://api.isthereanydeal.com/v01/game/prices/";
	const historicalURL = "https://api.isthereanydeal.com/v01/game/lowest/";

	async function getGameInfo(gameData: SearchResult, shop: string) {
		try {
			const shopName = shop;

			const currentPriceData = await getPrice(gameData.plain, shopName);
			const historicalLowData = await getHistoricalLow(
				gameData.plain,
				shopName
			);

			return {
				id: gameData.id.toString(),
				title: gameData.title,
				currentPrice: currentPriceData?.newPrice,
				originalPrice: currentPriceData?.originalPrice,
				originalCut: currentPriceData?.percentageCut,
				lowestPrice: historicalLowData?.lowestPrice,
				lowestCut: historicalLowData?.percentageCut,
			};
		} catch (err) {
			console.error("error in get game info: ", err);
		}
		return {
			id: "",
			title: "",
			currentPrice: "",
			originalPrice: "",
			originalCut: "",
			lowestPrice: "",
			lowestCut: "",
		};
	}

	async function getMultipleGames(game: string) {
		const urly = new URL(getGameURL);
		const plainArray = [];

		urly.searchParams.append("key", ITAD_API_KEY);
		urly.searchParams.append("q", game);
		urly.searchParams.append("limit", "10");
		urly.searchParams.append("strict", "0");

		try {
			const response = await fetch(urly);
			const res = await response.json();
			for (const game of res?.data?.results) {
				plainArray.push(game);
			}
			// console.log("REWQ plain array from multisearch: ", plainArray);
			setGameSearchList(plainArray);
			return res?.data?.results;
		} catch (err) {
			console.error("error in get multiple game: ", err);
		}
		return null;
	}

	async function getPrice(game: string, shop: string) {
		const urly = new URL(priceURL);
		urly.searchParams.append("key", ITAD_API_KEY);
		urly.searchParams.append("plains", game);
		urly.searchParams.append("shops", shop);

		try {
			const response = await fetch(urly);
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
		const urly = new URL(historicalURL);
		urly.searchParams.append("key", ITAD_API_KEY);
		urly.searchParams.append("plains", game);
		urly.searchParams.append("shops", shop);

		try {
			const response = await fetch(urly);
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
					return;
				}
				const multiGameInfo = await getMultipleGames(gameName);
				// console.log("REWQ Multi Game Info:", multiGameInfo);
				setGameSearchList(multiGameInfo);
				setFieldInput("");
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
				} = singleGameInfo;

				// console.log("REWQ Game Info:", gameInfo);
				// console.log("REWQ Single Game Info:", singleGameInfo);

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
	};

	const handleTextFieldSubmit = async () => {
		// setSelectedGame({
		// 	id: -1,
		// 	title: '',
		// 	plain: ''
		// })
		// setGameData({
		// 	id: "",
		// 	title: "",
		// 	currentPrice: "",
		// 	originalPrice: "",
		// 	originalCut: "",
		// 	lowestPrice: "",
		// 	lowestCut: "",
		// })
		setGameName(fieldInput);
		console.log('REWQ game list: ', gameSearchList)
		console.log('REWQ game data: ', gameData)
	};

	const handleGameSelect = async (id: number, plain: string, title: string) => {
		console.log("title is: ", title, " plain is: ", plain, "id is: ", id);
		setSelectedGame({
			id: id,
			plain: plain,
			title: title,
		});
		console.log('REWQ SELECT game list: ', gameSearchList)
		console.log('REWQ SELECT game data: ', gameData)
	};

	return (
		<>
			Test Section Row Component
			<p>Please search the name of the game you're looking for:</p>
			<TextField onChange={(e) => handleInputChange(e)} value={fieldInput} />
			<ButtonItem layout="below" onClick={handleTextFieldSubmit}>
				Submit!
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
							? gameSearchList.map((singleGame: SearchResult) => (
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
