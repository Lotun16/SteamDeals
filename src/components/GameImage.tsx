import imageUnavailable from "../images/imageUnavailable.png"
import { useState } from "react";

interface ImageProps {
    imagePlain: string
    imageGetter: any
}
const GameImage = ({imagePlain, imageGetter}: ImageProps) => {
    const [loadingImage, setLoadingState] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    const callWrapperTwo = async () => {
        const res = await imageGetter(imagePlain, 'steam');
        if(res){
            setImageUrl(res);
            return res;
        }
        else{
            setLoadingState(false)
        }
        return res;
    }

    callWrapperTwo();

    return ( 
        <>
            <div style={{display: 'flex'}}>
                {imageUrl ? 
                    <div>
                        <img src={imageUrl}  style={{width: '92px', border: '3px solid black', marginRight: '10px', marginLeft: '10px'}}/>
                    </div>
                :
                    (loadingImage ? 
                        <div>
                            <img alt="Loading" src="/images/steam_spinner.png" style={{width: '32px', border: '3px solid black', padding: '5.5px 30px', marginRight: '10px', marginLeft: '10px'}} />
                        </div>
                    :
                        <div>
                            <img alt="imageUn" src={imageUnavailable} style={{border: '3px solid black', padding: '5.5px 30px', marginRight: '10px', marginLeft: '10px'}}/>
                        </div>
                    )
                }
            </div>
        </>
     );
}
 
export default GameImage;