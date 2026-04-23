import { axiosCall } from "../lib/axios";

type OrderType = "SHORT" | "LONG" ; 
export const orderSercive = {
    createOrder : async(symbol : string , type : OrderType , quantity : number ,leverage:number, takeProfit? : number, stopLoss? : number) => {
        const payload : any = {
            symbol,
            type,
            quantity,
            leverage,
        };

        if (takeProfit) payload.takeProfit = takeProfit;
        if (stopLoss) payload.stopLoss = stopLoss;

        const response = await axiosCall.post('/position/open',payload);
        return response.data;
    },
    
    closeOrder : async( positionId : string) => {
        const response = await axiosCall.post('/position/close', { positionId });
        return response.data ;
    },

    getOpenOrders : async() => {
        const response = await axiosCall.get('/position/open-positions')
        return response.data 
    },

    getClosedOrdes : async() => {
        const response = await axiosCall.get('/position/closed-positions')
        return response.data
    }
}