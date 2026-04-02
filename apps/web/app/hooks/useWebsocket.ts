import { useEffect, useRef } from "react"
import { useMarketStore } from "../store/market.store"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9090" ;

export const useWebsocket = ()=>{
    const ws = useRef<WebSocket | null>(null);
    const { setPrice, setPositionUpdates} = useMarketStore();

    useEffect(()=>{
        
        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = ()=>{
            console.log("✅Websocket Connected");
        }

        ws.current.onmessage = (message) =>{
            const parsedMessage = JSON.parse(message.toString());

            if ( parsedMessage.kind === "price-latest"){
                const { symbol, ask, bid } = parsedMessage.data;
                setPrice(symbol,{ask,bid});
            }
            if( parsedMessage.kind === "position-latest"){
                const { positionId, unrealizedPnL } = parsedMessage.data;
                setPositionUpdates(positionId, unrealizedPnL);
            }

        }

        ws.current.onerror = (err) =>{
            console.log("Websocket Error: ",err);
        }

        ws.current.close = () =>{
            console.log("Websocket Disconnected");
        }

        return () =>{
            ws.current?.close()
        }
    },[])
}