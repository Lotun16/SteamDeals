import { VFC, useState } from "react";
import imageUnavailable from '../images/imageUnavailable64.png';

interface ImageProps {
    gameId: string;
}
const GameImage: VFC<ImageProps> = ({ gameId }) => {
    const [hasImage, setHasImage] = useState(true);
    console.log('gameId: ', gameId)

    return (
        !hasImage ? 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '165px', border: '3px solid black', backgroundColor: 'black' }}>
                <img
                    alt="imageUn"
                    src={imageUnavailable}
                />
            </div>

            :
            <img
                src={`https://dbxce1spal1df.cloudfront.net/${gameId}/banner400.jpg`}
                style={{ height: '100%', width: 'auto' }}
                onError={() => {
                    setHasImage(false);
                }}
            />
    );
}

export default GameImage;