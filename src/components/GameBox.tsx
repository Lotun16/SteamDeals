import { ButtonItem } from "decky-frontend-lib";
import GameImage from "./GameImage";
import { VFC } from 'react';


interface GameProps {
    gameId: string;
    gameTitle: string;
    onClick: () => void;
}

const GameBox: VFC<GameProps> = ({ gameId, gameTitle, onClick }) => {

    return (
        <ButtonItem
            layout="below"
            onClick={onClick}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', height: '60px' }}>
                <div style={{ height: 'calc(100% + 20px)', marginLeft: '-24px' }}>
                    <GameImage gameId={gameId} />
                </div>
                <div>
                    <h3>{gameTitle}</h3>
                </div>
            </div>
        </ButtonItem>
    );
}

export default GameBox;