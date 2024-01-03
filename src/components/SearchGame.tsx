import {
	ButtonItem,
	// PanelSectionRow,
	TextField,
	// DialogButton,
	// Menu,
	// MenuItem,
	// Router,
	// ServerAPI,
} from "decky-frontend-lib";
import { useState, useEffect } from "react";


const SearchGame = () => {

	const [fieldInput, setFieldInput] = useState('')

	const [gameDesc, setGameDesc] = useState('No Description Available')

	const [gameName, setGameName] = useState('');

	const [gameData, setGameData] = useState({
		id: '',
		title: '',
		currentPrice: '',
		originalPrice: '',
		originalCut: '',
		lowestPrice: '',
		lowestCut: '',
	})
	
	const ITAD_API_KEY = 'aa1c70075662a960294dd85e1dd78cd1ad4d26f7'

	const getGameURL = 'https://api.isthereanydeal.com/v02/search/search/'
	const priceURL = 'https://api.isthereanydeal.com/v01/game/prices/'
	const historicalURL = 'https://api.isthereanydeal.com/v01/game/lowest/'

	async function getGameInfo(game: string, shop: string){
		try{
			const trimmedGameName = game.replace(/ +/g, '');
			const shopName = shop;
		
			const gameData = await getGame(game);
			const currentPriceData = await getPrice(trimmedGameName, shopName);
			const historicalLowData = await getHistoricalLow(trimmedGameName, shopName);
		
			return {
				id: gameData.id,
				title: gameData.title,
				currentPrice: currentPriceData?.newPrice,
				originalPrice: currentPriceData?.originalPrice,
				originalCut: currentPriceData?.percentageCut,
				lowestPrice: historicalLowData?.lowestPrice,
				lowestCut: historicalLowData?.percentageCut
			};
		}
		catch (err) {
			console.error('error in get game info: ', err)
		}
		return {
			id: '',
			title: '',
			currentPrice: '',
			originalPrice: '',
			originalCut: '',
			lowestPrice: '',
			lowestCut: ''
		};
	}

	async function getGame(game: string) {
		const urly = new URL(getGameURL);
		urly.searchParams.append('key', ITAD_API_KEY)
		urly.searchParams.append('q', game)
		urly.searchParams.append('limit', '1')
		urly.searchParams.append('strict', '0')
	
		try{
			const response = await fetch(urly);
			const res = await response.json();
			return res?.data.results[0];
		}
		catch (err) {
			console.error('error in get game: ', err)
		}
		return null;
	}
	
	async function getPrice(game: string, shop: string) {
		const urly = new URL(priceURL);
		urly.searchParams.append('key', ITAD_API_KEY)
		urly.searchParams.append('plains', game)
		urly.searchParams.append('shops', shop)
	
		try{
			const response = await fetch(urly);
			const res = await response.json();
			const [newPrice, originalPrice, percentageCut] = [res.data[game].list[0]?.price_new, res.data[game].list[0]?.price_old, res.data[game].list[0]?.price_cut]
			return {newPrice, originalPrice, percentageCut};
		}
		catch (err) {
			console.error('error in get game price: ', err)
		}
		return null;
	}
	
	async function getHistoricalLow(game: string, shop: string) {
		const urly = new URL(historicalURL);
		urly.searchParams.append('key', ITAD_API_KEY)
		urly.searchParams.append('plains', game)
		urly.searchParams.append('shops', shop)
	
		try{
			const response = await fetch(urly);
			const res = await response.json();
			const [lowestPrice, percentageCut] = [res.data[game]?.price, res.data[game]?.cut]
			return {lowestPrice, percentageCut}
		}
		catch (err) {
			console.error('error in get game historical low: ', err)
		}
		return null;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const gameInfo  = await getGameInfo(gameName, 'steam')

				const {
					id,
					title,
					currentPrice,
					originalPrice,
					originalCut,
					lowestPrice,
					lowestCut,
				} = gameInfo

				console.log('REWQ game info: ', gameInfo)

				// setGameDesc(`${title} [ID: ${id}] is currently ${currentPrice}. The original sale price is ${originalPrice}. This is a deal of ${originalCut}%. The lowest price this game has ever been is ${lowestPrice}, a deal of ${lowestCut}%`);

				setGameData({
					id,
					title,
					currentPrice,
					originalPrice,
					originalCut,
					lowestPrice,
					lowestCut,
				  });
		  
				setFieldInput('');

			} catch (error) {
			  console.error('Error fetching data:', error);
			}
		  };
		  if (gameName !== '') {
			fetchData();
		  }
	  
	  
	}, [gameName]);

	const handleInputChange = (event: any) => {
		setFieldInput(event.target.value)
	}

	const handleTextFieldSubmit = async () => {
		console.log('REWQ: fieldInput is: ', fieldInput)
		setGameName(fieldInput);
	};

	return (
		<>
			Test Section Row Component
			<p>Please search the name of the game you're looking for:</p>
			<TextField onChange={(e) => handleInputChange(e)} value={fieldInput}/>
			<ButtonItem layout="below" onClick={handleTextFieldSubmit}>
				Submit!
			</ButtonItem>
			{
				gameData.title !== '' ?
				<div>
					<div>
						Title: {gameData.title}
					</div>
					<div>
						Id: {gameData.id}
					</div>
					<div>
						Original Price: {gameData.originalPrice}
					</div>
					<div>
						{
							gameData.currentPrice !== gameData.originalPrice ?
							<div>
								Sale Price: {gameData.currentPrice}  {'['} -{gameData.originalCut}% {']'}
							</div> :
							<div>
								Sale Price: {gameData.title} is not currently on sale
							</div>
						}
					</div>
					<div>
						{
							gameData.lowestPrice === '0' ?
							<div>
								Historical Low: {gameData.lowestPrice} {'['} -{gameData.lowestCut}% {']'}
							</div> :
							<div>
								Historical Low: {gameData.title} is already at it's lowest price
							</div>
						}
					</div>
				</div> :
				<div>
					Nothing yet
				</div>
			}
			

		</>
	);
};

export default SearchGame;
