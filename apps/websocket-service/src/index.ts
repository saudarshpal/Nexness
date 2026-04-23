import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { redis } from '@repo/redis';
import { parse } from "cookie";

interface JwtPayload {
    userId : string,
    email : string
}

const userSockets = new Map<string,WebSocket>();
const allsockets = new Set<WebSocket>();

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

        allsockets.forEach(socket => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ 
                kind: "price-latest", 
                data: price 
            }));
          }
        });
    }

    if (channel === "position-update"){

        const envelope = JSON.parse(message as unknown as string);

        const {userId,positionId,unrealizedPnL} = envelope.data;
        const roundedPnL = parseFloat(unrealizedPnL).toFixed(2)

        const userSocket  = userSockets.get(userId);

        if (userSocket && userSocket.readyState === WebSocket.OPEN) {
            userSocket.send(JSON.stringify({ 
                kind: "position-latest", 
                data: {positionId,unrealizedPnL : roundedPnL}
            }));
        }
       }
    })

ws.on('connection',(socket,req)=>{
    console.log('✅ Client connected ')
    allsockets.add(socket);

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token 

    if(token){
        try{
            const decoded = jwt.verify(token,"jwtsecret") as JwtPayload
            userSockets.set(decoded.userId,socket);
            console.log(`User ${decoded.email} authenticated via cookie`);
        }catch(e){
            console.log(`❌ Invalid token in cookie`)
        }
    }

    
    socket.on('error',(error)=>{
        console.log(`WebSocket Error : ${error}`);
    });


    socket.on('close',()=>{
        allsockets.delete(socket);

        for(const [userId,s] of userSockets) {
            if (s === socket){
                userSockets.delete(userId);
                console.log('👤 User Disconnected');
                break;
            }
        }
    })

    
})


    