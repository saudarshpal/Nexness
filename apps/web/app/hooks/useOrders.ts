import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { orderSercive } from "../services/order.service";

type OrderType = "SHORT" | "LONG"

export const useOrders = () => {

    const queryClient = useQueryClient()

    const createOrderMutation = useMutation({
        mutationFn : ({symbol, type, quantity, leverage, takeProfit, stopLoss} :
            {symbol : string,
            type : OrderType ,
            quantity:number ,
            leverage:number ,
            takeProfit? : number, 
            stopLoss? : number
        }) =>  orderSercive.createOrder(symbol, type, quantity, leverage, takeProfit, stopLoss),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: ['openOrders'] });
            console.log("Order created")
        },
        onError : (error : any) =>{
            console.log(error)
        }
    })

    const closeOrderMutation = useMutation({
        mutationFn : ( { positionId } : { positionId : string} ) => orderSercive.closeOrder(positionId),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: ['openOrders'] });
            queryClient.invalidateQueries({ queryKey: ['closedOrders'] });
            console.log(" Order Closed ");
        },
        onError : (error : any) => {
            console.log(error);
        }
    })

    const { data : openOrders } = useQuery({
        queryKey : ['openOrders'],
        queryFn : () => orderSercive.getOpenOrders(),
        retry : false,
        staleTime : 1000
    })

    const { data : closedOrders } = useQuery({
        queryKey : ['closedOrders'],
        queryFn : ()=> orderSercive.getClosedOrdes(),
        retry : false,
        staleTime : 1000
    })


    return {
        createOrderMutation,
        closeOrderMutation,
        openOrders,
        closedOrders
    }
}