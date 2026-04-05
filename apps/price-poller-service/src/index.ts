import WebSocket from "ws";
import { redis } from "@repo/redis"

const url = "wss://stream.binance.com:9443/ws";

let ws : WebSocket ;

const SPREAD_CONFIG = {
    btcusdt : 3
}

const startPricePoller = () => {
    ws = new WebSocket(url);

    ws.on("open", ()=>{
        console.log("✅ Connected to Binance");
        const subscribeRequest = {
            id : 1,
            method : "SUBSCRIBE",
            params : [ "btcusdt@bookTicker"]
        };
        ws.send(JSON.stringify(subscribeRequest));
    });

    ws.on("message", async(message) => {
        try{
            const data = JSON.parse(message.toString());  // message arrives as buffer 
            if(!data.s) return 

            const symbol = data.s.toLowerCase() as keyof typeof SPREAD_CONFIG
            const spread = SPREAD_CONFIG[symbol] 
            const halfSpread = spread/2
            
            const rawAsk = parseFloat(data.a)
            const rawBid = parseFloat(data.b)

            const markedAsk = (rawAsk + halfSpread).toFixed(2)
            const markedBid = (rawBid - halfSpread).toFixed(2)

            
            const envelope = JSON.stringify({ kind : "price-latest", data : {
                ...data,
                a : markedAsk,
                b : markedBid
            } })

            await Promise.all([
                redis.publish("prices",envelope),
                redis.set(`price:${symbol}`,JSON.stringify({
                    ask : markedAsk,
                    bid : markedBid,
                    timestamp : Date.now()
                }))
            ])
        }catch(err){
            console.log(err);
        }
    });

}

console.log("current status: ", redis.status)

redis.on('connect', () => {
  console.log('✅ Redis connection established');
});

redis.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});


startPricePoller();