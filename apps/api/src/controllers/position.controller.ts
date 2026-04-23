import{ type Request, type Response, type NextFunction } from 'express';
import { catchAsync } from "../utils/catchAsync";
import { closePositionSchema, openPositionSchema } from '../schemas/position.schema';
import { AppError } from '../middlewares/errorHandler';
import { ResponseStatus } from '../types';
import { prisma } from '@repo/database';
import { getCurrentPrice } from '../services/position.service';
import { symbol } from 'zod';




export const openPosition = catchAsync(async(req : Request, res : Response , next : NextFunction)=>{
    const action = "open";
    const userId = req.user.userId;
    const result = openPositionSchema.safeParse(req.body);
    if(!result.success) throw new AppError(ResponseStatus.BAD_REQUEST,"Validation Error");
    
    const user = await prisma.user.findUnique({where : { id : userId}})
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"User Not Found");

    const { symbol, type , leverage, quantity, takeProfit, stopLoss } = result.data;
    let currentPrice = await getCurrentPrice(symbol,type,action);

    const margin = (quantity*currentPrice)/leverage;
    if( user.walletBalance.lessThan(margin.toString()) ) throw new AppError(ResponseStatus.UNPROCESSABLE,"Insufficient Balance");

    const [position] = await prisma.$transaction([
        prisma.position.create({
            data : {
                userId,
                symbol,
                type,
                quantity : quantity.toString(),
                leverage, 
                openingPrice : currentPrice.toString(),
                takeProfit : takeProfit ? takeProfit.toString() : null,
                stopLoss : stopLoss ? stopLoss.toString() : null,
            }
        }),
        prisma.user.update({
            where : { id : userId},
            data : { walletBalance : {decrement : margin.toString()}}
        })
    ])
   
    return res.status(ResponseStatus.CREATED).json({msg:"Opened Positon", positionId: position.id})
});



export const closePosition = catchAsync(async(req: Request, res : Response , next : NextFunction)=>{
    const action = "close";
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({where : {id : userId}});
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"User Not Found");

    const result = closePositionSchema.safeParse(req.body);
    if(!result.success) throw new AppError(ResponseStatus.BAD_REQUEST,"Validation Error");
    const { positionId } = result.data;

    const position = await prisma.position.findUnique({where : {id : positionId}});
    if(!position) throw new AppError(ResponseStatus.BAD_REQUEST,"Position Not Found");
    if(position.status === "CLOSED") throw new AppError(ResponseStatus.BAD_REQUEST,"Position Already Closed");
    
    const openingPrice = Number(position.openingPrice);
    const quantity = Number(position.quantity);
    const leverage = position.leverage;
    const walletBalance = Number(user.walletBalance)

    const margin = (openingPrice * quantity)/leverage; 

    const currentPrice = await getCurrentPrice(position.symbol,
        position.type === "LONG" ? "SHORT" : "LONG",
        action
    );
    const realizedPnL = position.type === "LONG"
        ? (currentPrice - openingPrice) * quantity
        : (openingPrice - currentPrice) * quantity
    
    const updatedBalance = walletBalance + margin + realizedPnL;

    const [closedPosition] = await prisma.$transaction([
        prisma.position.update({
            where : {id : positionId},
            data : {
                closingPrice : currentPrice.toString(),
                pnl : realizedPnL.toString(),
                closeType : "MANUAL",
                closedAt : new Date(),
                status : "CLOSED"
            }
        }),
        prisma.user.update({
            where : { id : userId},
            data : { walletBalance : updatedBalance} 
        }),
        prisma.trade.create({
            data : {
                userId,
                positionId,
                balanceBefore : walletBalance,
                balanceAfter : updatedBalance
            }
        })
    ])
    res.status(ResponseStatus.OK).json({msg: "Position Closed Successfully",positionId : closedPosition.id})
})

export const getOpenPositions = catchAsync( async( req : Request, res : Response) => {
    const userId = req.user.userId;
    const positions = await prisma.position.findMany({
        where : {
            userId,
            status : "OPEN"
        },
        orderBy : {
            createdAt : 'desc'
        }
    });
    return res.status(200).json({ openPositions : positions });
})

export const getClosedPositions = catchAsync( async( req : Request, res : Response) => {
    const userId = req.user.userId;
    const positions = await prisma.position.findMany({
        where : {
            userId,
            status : "CLOSED"
        },
        include : {
            trade : true
        },  
        orderBy : {
            closedAt : 'desc'
        }
    });
    return res.status(200).json({ closedPositions : positions });
})