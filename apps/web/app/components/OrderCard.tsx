"use client"
import { useState } from "react"
import { useWebsocket } from "../hooks/useWebsocket";
import { useOrders } from "../hooks/useOrders";
import toast from "react-hot-toast";

type PositionType= "LONG" | "SHORT" 

export default function OrderCard() {
    const { priceUpdate } = useWebsocket()
    const [symbol,setSymbol] = useState('btcusdt')
    const [type , setType] = useState<PositionType>("LONG");
    const [quantity, SetQuantity] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [leverage, setLeverage] = useState(1);
    const { createOrderMutation } = useOrders()
    
    
    const numericQuantity = parseFloat(quantity) || 0 ;
    const askPrice = priceUpdate[symbol]?.ask ?? 0
    const bidPrice = priceUpdate[symbol]?.bid ?? 0

    const activePrice = type === "LONG" ? askPrice : bidPrice;

    const totalFees = activePrice * numericQuantity ;

    const requiredMargin = leverage > 0 ? totalFees / leverage : 0 ;
 

    const handleCreateOrder = async(e : React.FormEvent) => {
        e.preventDefault();

        if(!quantity){
        toast.error("Enter volume");
        return; 
        }
        
        try{
            const payload = {
                symbol, 
                type,
                quantity : parseFloat(quantity) || 0 ,
                leverage,
                takeProfit : takeProfit ? parseFloat(takeProfit) : undefined,
                stopLoss : stopLoss ? parseFloat(stopLoss) : undefined
            }
            await createOrderMutation.mutateAsync(payload)
        }catch(error){
            console.log("Order Creation Failed");
        }

    }
  return (
    <div className=" px-4 py-2 w-65 flex flex-col gap-3">
        <div className="flex rounded-xl overflow-hidden border border-gray-500">
            <button onClick={() => setType("LONG")}
                className={`flex-1 py-2 text-sm  font-semibold transition-colors ${type=="LONG" ? "bg-black text-white" : "text-black"}`}
            > LONG
            </button>

            <button onClick={() => setType("SHORT")}
                className={`flex-1 py-2 text-sm  font-semibold transition-colors ${type=="SHORT" ? "bg-black text-white" : "text-black"}`}
            > SHORT
            </button>
        </div>

        <div className="flex items-center justify-between ">
            <span className="text-sm">
                {type === "LONG" ? "Ask Price" : "Bid Price"}
            </span>
            <span className={`${ type === "LONG" ?  "text-red-600" : "text-green-700"} text-md font-bold`}
            > $ {type === "LONG" ?  priceUpdate[symbol]?.ask || "---" : priceUpdate[symbol]?.bid || "---" } 
            </span> 
        </div>

        <div className="flex flex-col gap-1.5">
            <label className="text-sm">Volume</label>
            <div className="flex items-center justify-between border border-black rounded-xl px-3 py-2">
                <input
                    value={quantity}
                    onChange={(e) => SetQuantity(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-sm w-full outline-none placeholder:text-gray-400"
                />
                <span className="text-sm ml-2">BTC</span>
            </div>
        </div>

        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <label className="text-sm">Leverage</label>
                <span className="text-sm ">{leverage}x</span>
            </div>
            <input
                type="range"
                min={1}
                max={100}
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value))}
                className="w-full accent-black"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm">
                    Take Profit (optional)
            </label>
            <input
                value={takeProfit}
                onChange={(e)=> setTakeProfit(e.target.value)}
                placeholder="0.00"
                className="text-sm w-full outline-none border border-black px-2 py-2 rounded-xl"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm">
                    Stopp Loss (optional)
            </label>
            <input
                value={stopLoss}
                onChange={(e)=> setStopLoss(e.target.value)}
                placeholder="0.00"
                className="text-sm w-full outline-none border border-black px-2 py-2     rounded-xl"
            />
        </div>

        <button onClick={handleCreateOrder} className={`w-full  font-semibold text-sm text-white rounded-xl bg-black px-3 py-2.5`}>
             {type === "LONG" ? "OPEN LONG" : "OPEN SHORT"}
        </button>


        <div className="border-y border-gray-400 py-4">
            <div className="flex items-center justify-between ">
                <span className="text-sm">Total Fees</span>
                <span className="text-sm font-medium">
                    $ {totalFees.toFixed(2)} 
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm">Required Margin</span>
                <span className="text-sm font-medium"> $ {requiredMargin.toFixed(2)} </span>
            </div>
        </div>
    </div>
  )
}