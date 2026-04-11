import { prisma } from "@repo/database";
import { AppError } from "../middlewares/errorHandler";
import { ResponseStatus } from "../types";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from "express";



export const getBalance = catchAsync(async(req : Request , res : Response) => {
    const  userId  = req.user.userId ;
    const user = await prisma.user.findUnique({ 
        where : { id : userId } ,
        select : {
            walletBalance : true 
        }
    });
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"USer Not Found")
    return res.status(ResponseStatus.OK).json({ userId , balance : user.walletBalance});
})


export const depositBalance = catchAsync(async(req : Request , res : Response) => {
    const  userId  = req.user.userId ;
    const  amount  = Number(req.body.amount); 
    if (isNaN(amount) || amount <= 0) {
        throw new AppError(ResponseStatus.BAD_REQUEST, "Invalid deposit amount");
    }
    let user = await prisma.user.findUnique({ 
        where : { id : userId } ,
        select : {
            walletBalance : true 
        }
    });
    if(!user) throw new AppError(ResponseStatus.NOT_FOUND,"User Not Found");

    user = await prisma.user.update({
        where : { id : userId },
        data : {
            walletBalance : {
                increment : amount
            }
        },
        select : {
            walletBalance : true
        }
    });

    return res.status(ResponseStatus.OK).json({ userId, balance : user.walletBalance });
 
})