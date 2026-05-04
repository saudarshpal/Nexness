import WebSocket from "ws";
import { redis } from "@repo/redis"

const url = "wss://stream.binance.com:9443/ws";

const SPREAD_CONFIG = {
    btcusdt : 3,
    ethusdt : 2,
    solusdt : 5
}

type Symbol = keyof typeof SPREAD_CONFIG; 

class PricePoller {
    private ws: WebSocket | null = null;
    private readonly symbols: Symbol[];
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts : number = 3 ;
    private isManualStop: boolean = false;

    constructor( symbols : Symbol[]){
        this.symbols = symbols || Object.keys(SPREAD_CONFIG) as Symbol[];
        console.log(`📊 Initialized PricePoller for symbols: ${this.symbols.join(', ')}`);
        this.startRedisListners();
    }

    private startRedisListners(): void {
        console.log("Redis Status: ",redis.status);

        redis.on('connect', () => {
            console.log('✅ Redis connection established');
        })

        redis.on('error', (error) => {
            console.log("❌Redis Error: ",error);
        })

    }

    private async processMessage(rawMessage: WebSocket.Data): Promise<void> {
        try{
            const message = rawMessage.toString();

            const data  = JSON.parse(message);

            if (data.ping) {
                console.log('📡 Received ping from Binance, sending pong...');
                this.ws?.send(JSON.stringify({ pong: data.ping }));
                return;
            }
            
            if(!data.s) return 

            const symbol = data.s.toLowerCase() as Symbol;

            if(!this.symbols.includes(symbol)) return;

            const spread = SPREAD_CONFIG[symbol];
            const halfSpread = spread /2;
            
            const rawAsk = parseFloat(data.a)
            const rawBid = parseFloat(data.b)

            const markedAsk = (rawAsk + halfSpread).toFixed(2)
            const markedBid = (rawBid - halfSpread).toFixed(2)

            const envelope = JSON.stringify({ 
                kind : "price-latest",
                data : {
                    ...data,
                    a : markedAsk,
                    b : markedBid
                } 
            })

            await Promise.all([
                redis.publish("prices",envelope),
                redis.set(`price:${symbol}`,JSON.stringify({
                    ask : markedAsk,
                    bid : markedBid,
                    timestamp : Date.now()
                }))
            ]);

        }catch(err){
            console.log('Message processing error:',err);
        }
    }

    private webSocketEventHandler():void {
        if(!this.ws) return;

        this.ws.on('open', () => {
            console.log("✅ Connected to Binance Websocket");
            this.reconnectAttempts = 0 ; //reset connection attempts on successfull connection 

            //subscribe message for symbol ticks
            const params = this.symbols.map(symbol => `${symbol}@bookTicker`);
            const subscribeRequest = {
                id : 1,
                method: "SUBSCRIBE",
                params: params
            };
            this.ws!.send(JSON.stringify(subscribeRequest));
            console.log(`📡Subscribing to : ${params.join(',')}`);
        })

        this.ws.on('message', async (message) => {
            await this.processMessage(message);
        })

        this.ws.on("close", (code, reason) => {
            console.log(`❌ WebSocket closed: ${code} - ${reason}`);

            if (!this.isManualStop) {
                this.handleDisconnect();
            }

        });

        this.ws.on('error', (error) => {
            console.log('❌Websocket Error:',error);

            if (!this.isManualStop) {
                this.handleDisconnect();
            }
        });
    }

    private handleDisconnect(): void {
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts <= this.maxReconnectAttempts) {
            console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
        } else {
            console.error(`❌ Failed to reconnect after ${this.maxReconnectAttempts} attempts. Giving up.`);
        }
    }

    private connect(): void {
        if (this.ws){
            console.log("🧹Cleaning up existing connection");
            this.ws.removeAllListeners();
            this.ws = null;
        }

        console.log("Connecting to Binance Websocket");
        this.ws = new WebSocket(url);
        this.webSocketEventHandler();
    }

    public start(): void {
        console.log("🚀Starting PricePoller....");
        this.isManualStop = false;
        this.connect();
    }

    public stop(): void {
        console.log('🛑 Stopping PricePoller..');
        this.isManualStop = true; 
        if(this.ws){
            this.ws.close();
            this.ws = null;
        }
    }

}

const pricePoller = new PricePoller(['btcusdt']);
pricePoller.start();

process.on('SIGINT', () => {
    console.log("\nRecieved SIGINT. Shutting down gracefully...");
    pricePoller.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log("\nRecieved SIGINT. Shutting down gracefully...");
    pricePoller.stop();
    process.exit(0);
});