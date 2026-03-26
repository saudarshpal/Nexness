import WebSocket from "ws";
import { redis } from "@repo/redis"

const url = "wss://stream.binance.com:9443/ws";

let ws : WebSocket ;

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
            const data = JSON.parse(message.toString());
            if(!data.s) return 
            const envelope = JSON.stringify({ kind : "price-latest", data : data })
            await Promise.all([
                redis.xadd( "engine-stream", "*", "data", envelope ), 
                redis.publish("prices",envelope),
                redis.set(`price:${data.s.toLowerCase()}`,data.a)
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