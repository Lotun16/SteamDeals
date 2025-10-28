import { VFC, useMemo } from 'react';
import { ITAD_STORE_ID_STEAM } from '../models/gameModel';
import { useItadPrices, useItadHistoricalLows } from '../hooks/useItad';
import GameImage from './GameImage';
import GamePrice from './GamePrice';
import HighlightText from './HighlightText';
interface GameDetailsProps {
    gameId: string;
    gameTitle: string;
}

// Create array outside component to avoid recreating on every render
const STEAM_SHOPS = [ITAD_STORE_ID_STEAM];

export const GameDetails: VFC<GameDetailsProps> = ({ gameId, gameTitle }) => {

    const { data: currentPrices, loading: pricesLoading, error: pricesError } = useItadPrices(gameId, STEAM_SHOPS);
    const { data: historicalLows, loading: lowsLoading, error: lowsError } = useItadHistoricalLows(gameId, STEAM_SHOPS);

    const loading = pricesLoading || lowsLoading;
    const error = pricesError || lowsError;

    const processedData = useMemo(() => {
        if (loading || error || !historicalLows) return null;
        
        return {
            prices: {
                current: currentPrices ? currentPrices.deals[0].price.amount : historicalLows.lows[0].regular.amount,
                original: historicalLows.lows[0].regular.amount,
                originalCut: currentPrices ? currentPrices.deals[0].cut : 0,
                lowest: historicalLows.lows[0].price.amount,
                lowestCut: historicalLows.lows[0].cut,
            },
            currency: historicalLows.lows[0].regular.currency
        };
    }, [currentPrices, historicalLows, loading, error]);

    return (
        loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '150px' }} />
            </div>
        ) : error || !processedData ? (
            <div style={{ padding: '25px 30px' }}>Couldn't get price data for {gameTitle}</div> //display on errors from api call or there are no price results
        ) : (
            <div style={{ display: "flex", gap: '25px', padding: '25px 30px', height: '200px' }}>
                <div style={{ height: '100%' }}>
                    <GameImage gameId={gameId} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <h1 style={{ margin: '0px', padding: '0px' }}>{gameTitle}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div>Original Price: {processedData?.currency} {processedData?.prices.original}</div>
                        <div>
                            Current Price:
                            <div>
                                {
                                    <GamePrice 
                                        currency={processedData?.currency} 
                                        price={processedData?.prices?.current} 
                                        cut={processedData?.prices?.current !== processedData?.prices?.original ? processedData?.prices?.originalCut : undefined} 
                                    />
                                }
                            </div>
                        </div>
                        <div>
                            Historical Low:
                            <div>
                                <GamePrice 
                                    currency={processedData?.currency} 
                                    price={processedData?.prices?.lowest} 
                                    cut={processedData?.prices?.lowestCut ? processedData?.prices?.lowestCut : undefined} 
                                />
                                {
                                processedData?.prices.lowest === processedData?.prices.current ?
                                    <HighlightText variant="buy">BUY</HighlightText>
                                        : 
                                    <HighlightText variant="wait">WAIT</HighlightText>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}