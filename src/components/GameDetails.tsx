import { VFC, useEffect, useState } from 'react';
import { GamePriceData, ITAD_STORE_ID_STEAM } from '../models/gameModel';
import { getGameHistoricalLowsItad, getGamePricesItad as getGamePricesItad } from '../utils/itad';
import GameImage from './GameImage';

interface GameDetailsProps {
    gameId: string;
    gameTitle: string;
}

async function getSteamPrices(gameId: string): Promise<{ prices: GamePriceData, currency: string } | undefined> {
    const shopId = ITAD_STORE_ID_STEAM;

    const currentResult = await getGamePricesItad(gameId, [shopId]); // if there's no current deal in the selected store the results will be empty, we have to determine current prices based on getGameHistoricalLowsItad call
    const lowestResult = await getGameHistoricalLowsItad(gameId, [shopId]);

    if (!lowestResult || currentResult === undefined) return; // if theres no results from getGameHistoricalLowsItad we cant determine prices or if currentResult is undefined there was an error

    return {
        prices: {
            current: currentResult ? currentResult.deals[0].price.amount : lowestResult.lows[0].regular.amount,
            original: lowestResult.lows[0].regular.amount,
            originalCut: currentResult ? currentResult.deals[0].price.amount : 0,
            lowest: lowestResult.lows[0].price.amount,
            lowestCut: lowestResult.lows[0].cut,
        },
        currency: lowestResult.lows[0].regular.currency
    };
}

export const GameDetails: VFC<GameDetailsProps> = ({ gameId, gameTitle }) => {
    const [prices, setPrices] = useState<GamePriceData | null | undefined>(undefined); //use undefined for loading and null if no result or error
    const [currency, setCurrency] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const priceInfo = await getSteamPrices(gameId);
            if (!priceInfo) {
                setPrices(null);
                return;
            }
            const { prices, currency } = priceInfo;

            setPrices(prices);
            setCurrency(currency);
        }
        fetchData();
    }, [])

    return (
        prices === undefined ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '150px' }} />
            </div>
        ) : prices === null ? (
            <div style={{ padding: '25px 30px' }}>Couldn't get price data for {gameTitle}</div> //display on errors from api call or there are no price results
        ) : (
            <div style={{ display: "flex", gap: '25px', padding: '25px 30px', height: '200px' }}>
                <div style={{ height: '100%' }}>
                    <GameImage gameId={gameId} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                    <h1 style={{ margin: '0px', padding: '0px' }}>{gameTitle}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div>Original Price: {currency} {prices.original}</div>
                        <div>
                            {`Sale Price: ${prices.current !== prices.original ?
                                `${currency} ${prices.current} [ - ${prices.originalCut}% ]` :
                                `${gameTitle} is not currently on sale`}
                            `}
                        </div>
                        <div>
                            {`Historical Low: ${prices.lowest !== prices.current ?
                                `${currency} ${prices.lowest} [ - ${prices.lowestCut}% ]` :
                                `${gameTitle} is already at it's lowest price`}
                            `}
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}