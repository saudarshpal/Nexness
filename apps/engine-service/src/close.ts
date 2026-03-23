import { prisma } from "@repo/database"
import { CloseType } from "@repo/database"

interface Updates{
    closingPrice : number,
    unrealizedPnL:number,
    margin : number,
    currentBalance : number,
}
export const closePosition = async(
    userId : string,
    positionId : string,
    updates : Updates,
    closeType : CloseType,
    )=>{
    const updatedBalance = updates.currentBalance + updates.unrealizedPnL + updates.margin; 
    const [colsePosition] = await prisma.$transaction([
        prisma.position.update({
            where : { id : positionId},
            data : {
                closingPrice : updates.closingPrice,
                pnl : updates.unrealizedPnL,
                closeType ,
                closedAt : new Date(),
                status : "CLOSED",
            }
        }),
        prisma.user.update({
            where : {id : userId },
            data  :{
                walletBalance : updatedBalance
            }
        }),
        prisma.trade.create({
            data : {
                userId,
                positionId,
                balanceBefore : updates.currentBalance,
                balanceAfter : updatedBalance,
            }
        })
    ]) 
    return colsePosition.id;
}