import { create } from "zustand"

interface Price{
    ask : string,
    bid : string,
}

interface Marketstore{
    prices : Record<string,Price>
    positionUpdates : Record<string,number>
    setPrice : (symbol : string , price : Price) => void
    setPositionUpdates : (positionId : string , pnl : number) => void 
}


export const useMarketStore = create<Marketstore>((set)=>({
    prices : {},
    positionUpdates : {},

    setPrice : (symbol,price) => set((state)=>({
        prices : { ...state.prices, [symbol]:price}
    })),

    setPositionUpdates : (positionId, pnl) => set((state) =>({
        positionUpdates : { ...state.positionUpdates, [positionId]:pnl}
    }))
}))