import { DialogButton, Field, Focusable, PanelSectionRow, TextField, gamepadDialogClasses, quickAccessControlsClasses } from "decky-frontend-lib";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ScrollableWindow } from './ScrollableWindow';
import GameBox from "./GameBox";
import { ITADSearchResultItem } from "../models/gameModel";
import { GameDetails } from './GameDetails';
import { getSearchResultsItad } from '../utils/itad';
import { FaArrowLeft } from 'react-icons/fa';

const SearchGame = () => {
    const [fieldInput, setFieldInput] = useState("");
    const [gameSearchList, setGameSearchList] = useState<ITADSearchResultItem[]>([]);
    const [fixedDivHeight, setFixedDivHeight] = useState(0);
    const [selectedGame, setSelectedGame] = useState<{ gameId: string, gameTitle: string } | null>(null);

    const fixedDivRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (fixedDivRef.current) setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }, []);

    useEffect(() => {
        if (fieldInput === "") {
            setGameSearchList([]);
            return;
        }
        const fetchData = async () => {
            const searchResults = await getSearchResultsItad(fieldInput);
            if (!searchResults) return;

            setGameSearchList(searchResults);
        }
        fetchData();
    }, [fieldInput]);

    const handleInputChange = (event: any) => {
        setFieldInput(event.target.value);
        setSelectedGame(null);
    };

    const handleReset = () => {
        setFieldInput("");
        setSelectedGame(null);
        setGameSearchList([]);
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
            <div className='search-game-container' style={{ position: 'absolute', width: '100%', top: 'var(--basicui-header-height)', bottom: 'var(--gamepadui-current-footer-height)' }}>
                <div ref={fixedDivRef}>
                    <h1 style={{ margin: 0, padding: '15px 20px 5px' }}> {/* margin needs to be 0 for the height calculation to be correct */}
                        Steam Deals Search
                    </h1>
                    <Field description={
                        <Focusable style={{ display: "flex", flexDirection: "row", gap: '10px', padding: '0 16px' }}>
                            <div style={{ width: "100%" }}>
                                <TextField placeholder='Search Game' onChange={(e) => handleInputChange(e)} value={fieldInput} />
                            </div>
                            <DialogButton style={{ display: 'flex', alignItems: 'center', width: 'auto', minWidth: '20px' }} onClick={() => setSelectedGame(null)} disabled={!selectedGame} focusable={!!selectedGame} >
                                <FaArrowLeft />
                            </DialogButton>
                            <DialogButton style={{ width: '100px', minWidth: '100px' }} onClick={handleReset}>
                                Reset
                            </DialogButton>
                        </Focusable>}
                    />
                </div>
                <ScrollableWindow fadeAmount='12px' height={`calc(100% - ${fixedDivHeight}px)`} scrollBarWidth='0px'>
                    {selectedGame ? <GameDetails {...selectedGame} /> :
                        <PanelSectionRow>
                            <div>
                                {gameSearchList.map((game: ITADSearchResultItem) => (
                                    <div key={game.id}>
                                        <GameBox gameId={game.id} gameTitle={game.title} onClick={() => setSelectedGame({ gameId: game.id, gameTitle: game.title })} />
                                    </div>
                                ))}
                            </div>
                        </PanelSectionRow>
                    }
                </ScrollableWindow>
            </div>
        </>
    );
};

export default SearchGame;
