import { AppError } from "../middlewares/errorHandler";
import { ResponseStatus } from "../types";
import { catchAsync } from "../utils/catchAsync";
import { redis } from '@repo/redis'



export const getCurrentPrice = (async( symbol:string, type : "LONG" | "SHORT"  , action : "open" | "close" ) : Promise<number>=>{
    const priceData = await redis.get(`price:${symbol}`);
    if(!priceData) throw new AppError(ResponseStatus.UNPROCESSABLE,"Retry!! Price feed Unavailable");

    const { ask,bid,timestamp} = JSON.parse(priceData);

    if(Date.now() - timestamp > 2000) throw new AppError(ResponseStatus.UNPROCESSABLE,"Retry!! Price feed Unavailable");

     if(action === "open") {
    return type === "LONG" ? Number(ask) : Number(bid)
  } else {
    return type === "LONG" ? Number(bid) : Number(ask)
  }
})
