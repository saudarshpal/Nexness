import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { redis } from '@repo/redis';


interface JwtPayload{
    userId : string
}

const clients = new Map<string,WebSocket>();

const ws = new WebSocketServer({port : 9090})

const redisSub = redis.duplicate();

await redisSub.subscribe('prices',"position-update");

redisSub.on("message",(channel,message)=>{

    if (channel === "prices"){ 

        const envelope = JSON.parse(message as unknown as string);

        const {s,a,b} = envelope.data ;
        const price = {
            symbol : s.toLowerCase(),
            ask : parseFloat(a).toFixed(2),
            bid : parseFloat(b).toFixed(2)
        }

        for( const [userId, socket] of clients){
            if( socket.readyState === WebSocket.OPEN){
                socket.send(JSON.stringify({kind:"price-latest",data : price}))
            }
        }
    }

    if (channel === "position-update"){

        const envelope = JSON.parse(message as unknown as string);

        const {userId,positionId,unrealizedPnL} = envelope.data;
        const roundedPnL = parseFloat(unrealizedPnL).toFixed(2)

        const socket = clients.get(userId);
        if ( socket && socket.readyState === WebSocket.OPEN){
            socket.send(JSON.stringify({kind : "position-latest", data : {positionId,unrealizedPnL : roundedPnL}}));
        } 

    }
})

ws.on('connection',(socket)=>{
    socket.on('error',(error)=>{
        console.log(`WebSocket Error : ${error}`);
    });

    socket.on('message',async(message)=>{
        try{
            const parsedMessage = JSON.parse(message as unknown as string);

            if (parsedMessage.type === "auth") {
                const token = parsedMessage.token;
                const decoded = jwt.verify(token,"jwtsecret") as JwtPayload; 
                clients.set(decoded.userId,socket);
                socket.send(JSON.stringify({type: "auth", status : "success"}));
                }
        }catch(err){
            socket.send(JSON.stringify({type : "auth",status : "invalid token"}))
        }   
    });

    socket.on('close',()=>{
        for(const [userId, s] of clients){
            if (s === socket) {
                clients.delete(userId);
                break;
            }
        }
    })
    
})


    