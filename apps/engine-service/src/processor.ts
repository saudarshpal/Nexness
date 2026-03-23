import { prisma } from '@repo/database'
import { closePosition } from './close';
import { redis } from '@repo/redis';
import { CloseType } from '@repo/database';

let openPosition : Map<string,any[]> = new Map()   

export const refreshPositions = async()=>{
    const positions = await prisma.position.findMany({
        where : {  status : "OPEN" },
        include : {  user : true }
    })

    const grouped = new Map<string,any[]>()
    for(const position of positions){
        const existing = grouped.get(position.symbol) || [];
        existing.push(position);
        grouped.set(position.symbol,existing);
    }
    openPosition = grouped;
}

const removeFromcache = (symbol:string, positionId : string) =>{
    const cached = openPosition.get(symbol) || [] ;
    openPosition.set(symbol,cached.filter(p=> p.id !== positionId)) ; 
}

export const processTick = async(symbol : string,currentPrice: number) => {
    console.log("processTick called:",symbol,currentPrice);
    const positions = openPosition.get(symbol) || []
    console.log("total open positions:",positions.length);
    for ( const position of positions){
        const quantity = Number(position.quantity);
        const openingPrice = Number(position.openingPrice);
        const leverage = position.leverage;

        const margin = (openingPrice * quantity)/leverage;
        const unrealizedPnL = position.type === "LONG"
                ? (currentPrice - openingPrice) * quantity
                : (openingPrice - currentPrice) * quantity

        const currentBalance = Number(position.user.walletBalance);

        const equity  = currentBalance + unrealizedPnL ; 
        const marginRatio = (equity/margin)*100 ;

        const takeProfit = position.takeProfit ? Number(position.takeProfit) : null;
        const stopLoss =  position.stopLoss ? Number(position.stopLoss) : null

        const LimitClose = checkLimits(currentPrice,takeProfit,stopLoss);

        const userId = position.user.id;
        const positionId = position.id;
        const positionCloseUpdate = {
            closingPrice : currentPrice,
            unrealizedPnL,
            margin,
            currentBalance
        }
      
        if( marginRatio < 50 ){
            await closePosition(userId,positionId,positionCloseUpdate,CloseType.LIQUIDATION);
            removeFromcache(symbol, positionId);
        }
        else if (LimitClose === CloseType.TAKE_PROFIT){
            await closePosition(userId,positionId,positionCloseUpdate,CloseType.TAKE_PROFIT);
            removeFromcache(symbol, positionId);
        }
        else if (LimitClose === CloseType.STOP_LOSS){
            await closePosition(userId,positionId,positionCloseUpdate,CloseType.STOP_LOSS);
            removeFromcache(symbol, positionId);
        }
        else{
            const update = JSON.stringify({ 
                kind : "position-latest",
                userId, positionId,
                unrealizedPnL
            })
            await redis.publish("position-update",update)
        }
    }
}

setInterval(refreshPositions,5000);

const checkLimits = (currentPrice:number, takeProfit:number | null, stopLoss:number | null) : string =>{
    if (takeProfit &&  currentPrice >= takeProfit ) return CloseType.TAKE_PROFIT;
    else if(stopLoss && currentPrice <= stopLoss) return CloseType.STOP_LOSS;
    return "";
}

