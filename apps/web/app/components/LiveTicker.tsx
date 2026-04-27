"use client"
import React from 'react'
import { useWebsocket } from '../hooks/useWebsocket'

const LiveTicker = () => {
    const { priceUpdate } = useWebsocket();
    
    return (
        <div className='flex flex-col w-60 pl-5 pr-1 gap-4'> 
            <div className='flex justify-between items-center  mt-5'>
                <span className='font-semibold'>Market Data</span>
                <div className='text-xs bg-green-200 text-green-900 rounded-full px-3 py-1'>LIVE </div> 
            </div>
            <div className='grid grid-cols-3 justify-between text-sm border-b border-gray-400 pb-3'>
                <span >Symbol</span>
                <span className='text-center'>Bid</span>
                <span className='text-center'>Ask</span>
            </div>
            <div className='flex-col text-sm  '>
                {Object.entries(priceUpdate).map(([symbol, priceData]) => (
                    <div key={symbol} className='grid grid-cols-3 mb-4'>
                        <span>{symbol.toUpperCase()}</span>
                        <span className='text-green-700 text-center'>{priceData.bid || "---"}</span>
                        <span  className='text-red-600 text-center'>{priceData.ask || "---"}</span>
                    </div>
                ))}
                  
            </div>   
        </div>
    )
}

export default LiveTicker