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

	// const [input, setInput] = useState('')

	const [gameName, setGameName] = useState("Default Game Name");

	// const handleInputChange = (event: any) => {
	// 	setInput(event.target.value)
	// }

	const handleTextFieldSubmit = (inputText: string) => {
		console.log("handling click", inputText);
		console.log("testing dev thing")
		setGameName(inputText);
	};
	return (
		<>
			Test Section Row Component
			<p>Please search the name of the game you're looking for:</p>
			<TextField />
			<ButtonItem layout="below" onClick={() => handleTextFieldSubmit('Pass Value')}>
				Submit!
			</ButtonItem>
			{gameName}
		</>
	);
};

export default SearchGame;
