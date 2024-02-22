import { VFC, useState } from "react";

interface ImageProps {
    gameId: string;
}
const GameImage: VFC<ImageProps> = ({ gameId }) => {
    const [hasImage, setHasImage] = useState(true);

    return (
        !hasImage ? null :
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