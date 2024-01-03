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
import { useState } from "react";


const SearchGame = () => {

	const [fieldInput, setFieldInput] = useState('')

	const [gameDesc, setGameDesc] = useState('No Description Available')

	const [gameName, setGameName] = useState("Default Game Name");

	const ITAD_API_KEY = 'aa1c70075662a960294dd85e1dd78cd1ad4d26f7'

	const getGameURL = 'https://api.isthereanydeal.com/v02/search/search/'
	const priceURL = 'https://api.isthereanydeal.com/v01/game/prices/'
	const historicalURL = 'https://api.isthereanydeal.com/v01/game/lowest/'

	async function getGameInfo(game: string, shop: string){
		try{
			console.log('running get game info')
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
			id: 'blank id',
			title: 'blank title',
			currentPrice: 'blank current currentPrice',
			originalPrice: 'blank originalPrice',
			originalCut: 'blank originalCut',
			lowestPrice: 'blank lowestPrice',
			lowestCut: 'blank lowestCut'
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

	const handleInputChange = (event: any) => {
		setFieldInput(event.target.value)
	}

	const handleTextFieldSubmit = async () => {
		setGameName(fieldInput);
		const gameInfo  = await getGameInfo('fallout iv', 'steam')
		const {
			id,
			title,
			currentPrice,
			originalPrice,
			originalCut,
			lowestPrice,
			lowestCut,
		} = gameInfo
		setGameName(fieldInput)
		setGameDesc(`${title} [ID: ${id}] is currently ${currentPrice}. The original sale price is ${originalPrice}. This is a deal of ${originalCut}%. The lowest price this game has ever been is ${lowestPrice}, a deal of ${lowestCut}%`)
		console.log('hello');
	};

	return (
		<>
			Test Section Row Component
			<p>Please search the name of the game you're looking for:</p>
			<TextField onChange={(e) => handleInputChange(e)}/>
			<ButtonItem layout="below" onClick={handleTextFieldSubmit}>
				Submit!
			</ButtonItem>
			{gameName}
			<div>-----</div>
			{gameDesc}
		</>
	);
};

export default SearchGame;
