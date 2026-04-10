import { timeStamp } from "console";
import { useEffect, useRef, useState } from "react"


const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9090" ;

interface PriceData{
    ask : number 
    bid : number
    timestamp : number
}

interface pnlUpdate{
    unrealizedPnL : number
    timestamp : number
}

export const useWebsocket = ()=>{
    const [priceUpdate, setPriceUpdate] = useState<Record<string,PriceData>>({})
    const [positionUpdate, setPositionUpdate] = useState<Record<string,pnlUpdate>>({}); 
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(()=>{
        const connect = () =>{
            try{
                const ws = new WebSocket(WS_URL);
                wsRef.current = ws

                ws.onopen = ()=>{
                    console.log("✅Websocket Connected");
                }

                ws.onmessage = (message) =>{
                    try{
                        const parsedMessage = JSON.parse(message.data);

                        if ( parsedMessage.kind === "price-latest"){
                            const data = parsedMessage.data;
                            setPriceUpdate((prev) => ({
                                ...prev ,
                                [data.symbol] : {
                                    ask : data.ask,
                                    bid : data.bid,
                                    timestamp : Date.now()
                                }
                            }))    
                        }
                        if( parsedMessage.kind === "position-latest"){
                            const data = parsedMessage.data;
                            setPositionUpdate((prev)=> ({
                                ...prev,
                                [data.positionId] : {
                                    unrealizedPnL : data.unrealizedPnL,
                                    timeStamp : Date.now()
                                }
                            }))
                        }
                        else if (parsedMessage.type === "auth") {
                                console.log("Server Auth Status:", parsedMessage.status);
                        }
                    }catch(error){
                        console.log("Failed to parse websocket message",error);
                    }
                }

                ws.onclose = () =>{
                    console.log("Websocket disconnected, Reconnecting...");
                    setTimeout(connect,3000);
                }

                ws.onerror = (error) =>{
                    console.log("❌Websocket Error:",error);
                }

            }catch(error){
                console.log("❌Error connecting to Websokcet");
                setTimeout(connect,3000);
            }
        };
        connect();

        return ()=>{
            if(wsRef.current){
                wsRef.current.close();
            }
        }
    },[])

    return {priceUpdate,positionUpdate}
}