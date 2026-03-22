import z from 'zod';

export const openPositionSchema = z.object({
    symbol : z.enum(["btcusdt","ethusdt","solusdt"]),
    quantity : z.number().positive(),
    type : z.enum(["SHORT","LONG"]),
    leverage : z.number().int().min(1).max(100),
    takeProfit : z.number().positive().optional(),
    stopLoss : z.number().positive().optional()
})

export const closePositionSchema = z.object({
    positionId : z.string().trim()
})