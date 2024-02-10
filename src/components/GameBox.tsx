import { ButtonItem } from "decky-frontend-lib";
import { ITADSearchResultItem } from "../models/gameModel";
import GameImage from "./GameImage";


interface GameProps {
    game: ITADSearchResultItem
    handleSelect: any
    getInfo: any
}

const GameBox = ({game, handleSelect, getInfo}: GameProps) => {

    return (
        <ButtonItem
            layout="below"
            onClick={() => handleSelect(game.id,game.plain,game.title)}
        >
            <div style={{ display: 'flex', alignItems: 'center', flexBasis: 2 }}>
                <GameImage imagePlain={game.plain} imageGetter={getInfo}/>
                <div>
                    <h3>{game.title}</h3>
                </div>
            </div>
        </ButtonItem>
     );
}
 
export default GameBox;