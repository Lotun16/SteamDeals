import { DialogButton, Field, Focusable, PanelSectionRow, TextField, gamepadDialogClasses, quickAccessControlsClasses } from "decky-frontend-lib";
import { useState, useRef, useLayoutEffect } from "react";
import useAutoFocus from '../hooks/useAutoFocus';
import { ScrollableWindow } from "./ScrollableWindow";
import GameBox from "./GameBox";
import { ITADSearchResultItem } from "../models/gameModel";
import { SearchSettingsType } from "../models/pluginModel";
import { GameDetails } from "./GameDetails";
import { useItadSearch } from "../hooks/useItad";
import { FaArrowLeft, FaCog } from "react-icons/fa";

interface SearchGameProps {
	settings: SearchSettingsType;
	onOpenSettings?: () => void;
}

const SearchGame = ({ settings, onOpenSettings }: SearchGameProps) => {
	console.log("SearchGame Props - Settings:", settings);

	const [fieldInput, setFieldInput] = useState("");
	const [fixedDivHeight, setFixedDivHeight] = useState(0);
	const [selectedGame, setSelectedGame] = useState<{ gameId: string; gameTitle: string } | null>(null);

	const fixedDivRef = useRef<HTMLDivElement>(null);
	const searchRef = useAutoFocus();

	useLayoutEffect(() => {
		if (fixedDivRef.current) setFixedDivHeight(fixedDivRef.current.offsetHeight);
	}, []);

	const { data: gameSearchList, loading, error } = useItadSearch(fieldInput);

	console.log("REWQ Input: ", fieldInput, "Loading:", loading, "Error:", error, "Data:", gameSearchList);
	const handleInputChange = (event: any) => {
		setFieldInput(event.target.value);
		setSelectedGame(null);
	};

	const handleReset = () => {
		setFieldInput("");
		setSelectedGame(null);
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
            .search-game-container .${gamepadDialogClasses.Button} {
                overflow: hidden;
            }
            `}</style>
			<div className="search-game-container" style={{ position: "absolute", width: "100%", top: "var(--basicui-header-height)", bottom: "var(--gamepadui-current-footer-height)" }}>
				<div ref={fixedDivRef}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px 5px" }}>
						<h1 style={{ margin: 0, padding: "15px 20px 5px" }}>Steam Deals Search</h1>
						<div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
							<p>Country: {settings.country}</p>
							<p>Shop: {settings.shop}</p>
							<DialogButton style={{ display: "flex", alignItems: "center", width: "auto", minWidth: "20px" }} onClick={onOpenSettings}>
								<FaCog style={{ fontSize: "20px" }} />
							</DialogButton>
						</div>
					</div>
					<Field
						description={
							<Focusable style={{ display: "flex", flexDirection: "row", gap: "10px", padding: "0 16px" }}>
								<div style={{ width: "100%" }}>
									<div ref={searchRef}>
										<TextField placeholder="Search Game" onChange={(e) => handleInputChange(e)} value={fieldInput} />
									</div>
								</div>
								<DialogButton
									style={{ display: "flex", alignItems: "center", width: "auto", minWidth: "20px" }}
									onClick={() => setSelectedGame(null)}
									disabled={!selectedGame}
									focusable={!!selectedGame}
								>
									<FaArrowLeft />
								</DialogButton>
								<DialogButton style={{ width: "100px", minWidth: "100px" }} onClick={handleReset}>
									Reset
								</DialogButton>
							</Focusable>
						}
					/>
				</div>
				<ScrollableWindow fadeAmount="12px" height={`calc(100% - ${fixedDivHeight}px)`} scrollBarWidth="0px">
					{selectedGame ? (
						<GameDetails {...selectedGame} />
					) : (
						<PanelSectionRow>
							<div>
								{error && <div>Error: {error}</div>}
								{gameSearchList?.map((game: ITADSearchResultItem) => (
									<div key={game.id}>
										<GameBox gameId={game.id} gameTitle={game.title} onClick={() => setSelectedGame({ gameId: game.id, gameTitle: game.title })} />
									</div>
								))}
							</div>
						</PanelSectionRow>
					)}
				</ScrollableWindow>
			</div>
		</>
	);
};

export default SearchGame;

//TODO: Set a settings page  to view and set preferred shops / regions for price checking
