"use client"
import Link from 'next/link'
import React from 'react'
import { useAuth } from '../hooks/useAuth'

const pills = [
  "⚡ Sub-second execution",
  "🔒 Isolated margin protection",
  "📊 Live PnL tracking"
]

const stats = [
  { value: "$2.4B+", label: "Volume Traded" },
  { value: "3 Assets", label: "Available" },
  { value: "100x", label: "Max Leverage" },
]

const Hero = () => {
    const { isAuthenticated } = useAuth()
    return (

        <section className='flex flex-col items-center text-center mt-2 px-4 gap-2'>
            <div className='font-semibold text-6xl mt-8'>
                Trade Smarter.<br />
                React Faster.
            </div>

            <p className='mt-3'>
                Real-time crypto trading with institutional-grade execution.<br />
                Go long or short on BTC, ETH and SOL with up to 100x leverage. 
            </p>

            <div className='flex gap-3 mt-3'>
                {pills.map((pill) => (
                    <span key={pill} className='text-sm px-4 py-2 border border-gray-300 rounded-full  backdrop-blur-sm'>
                        {pill}
                    </span>
                ))}
            </div>

            <div className='flex gap-6 mt-4'>
                <Link href={`/terminal`} className='bg-black text-white font-semibold px-6 py-3 border border-black rounded-full backdrop-blur-sm hover:bg-black/90'>
                  Let's Trade →
                </Link>
            </div>  
        </section>
    )
}

export default Hero