import { AppError } from "../middlewares/errorHandler";
import { ResponseStatus } from "../types";
import { catchAsync } from "../utils/catchAsync";
import { redis } from '@repo/redis'



export const getCurrentPrice = (async(symbol:string) : Promise<number>=>{
    const price = await redis.get(`price:${symbol}`);
    if(!price) throw new AppError(ResponseStatus.UNPROCESSABLE,"Retry!! Price feed Unavailable");
    return Number(price);
})

getCurrentPrice('btcusdt')