"use client"
import React from 'react'
import { useWebsocket } from '../hooks/useWebsocket'

const LiveTicker = () => {
    const { priceUpdate } = useWebsocket();
    
    return (
        <div className='flex flex-col w-65 pl-5 gap-5'> 
            <div className='flex justify-between items-center  mt-5'>
                <span className='font-semibold'>Market Data</span>
                <div className='text-xs bg-green-200 text-green-900 rounded-full px-3 py-1'>LIVE </div> 
            </div>
            <div className='flex justify-between text-sm border-b border-gray-400 pb-3'>
                <span >Symbol</span>
                <div className='flex justify-between gap-15'>
                    <span >Bid</span>
                    <span >Ask</span>
                </div>

            </div>
            <div className='flex justify-between  text-sm  pb-3'>
                {Object.entries(priceUpdate).map(([symbol, priceData]) => (
                    <>
                        <span key={symbol} >{symbol.toUpperCase()}</span>
                        <div className='flex justify-between gap-3 '>
                            <span key={priceData.bid} className='text-green-700'>{priceData.bid || "63000"}</span>
                            <span key={priceData.ask} className='text-red-600'>{priceData.ask || "65000"}</span>
                        </div>
                    </>
                ))}
                  
            </div>   
        </div>
    )
}

export default LiveTicker