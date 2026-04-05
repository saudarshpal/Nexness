import { redis } from '@repo/redis';
import { processTick, refreshPositions } from './processor';

const SYMBOLS = ["btcusdt"]
const MAX_PRICE_AGE = 2000
const POLL_INTERVAL = 500

const startEngine = async()=>{
    console.log("starting engine ⚙️");
    await refreshPositions();
    while(true){
        for(const symbol of SYMBOLS){
            const raw = await redis.get(`price:${symbol}`)
            if (!raw) continue;
            const priceData = JSON.parse(raw);
            const age = Date.now() - priceData.timestamp
            if(age > MAX_PRICE_AGE) {
                console.log(`${symbol} price stale (${age}ms), skipping`);
                await redis.del(`price:${symbol}`);
                continue ; 
                
            }
            const price = {
                ask : priceData.ask,
                bid : priceData.bid
            }
            await processTick(symbol,price);
        }
        await new Promise( resolve => setTimeout(resolve, POLL_INTERVAL)) ; 
    };
}

startEngine();