import HighlightText from "./HighlightText";

interface GamePriceProps {
    currency: string;
    price: number;
    cut?: number;
}

const GamePrice = ({ currency, price, cut }: GamePriceProps) => {
    return (  
        <>
        {currency} {price}
        {cut && (
            <HighlightText variant="discount">- {cut}%</HighlightText>
        )}
        </>
    );
}

export default GamePrice;