"use client"
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../hooks/useAuth';


const pills = [
  "⚡ Sub-second execution",
  "🔒 Isolated margin protection",
  "📊 Live PnL tracking"
]

const stats = [
  { value: "$2.4B+", label: "Volume Traded" },
  { value: "24/7",   label: "Live Markets"  },
  { value: "100x", label: "Max Leverage" },
]

const Hero = () => {
    const { isAuthenticated } = useAuth();

    return (

        <section className='flex flex-col items-center text-center  px-4 gap-2'>
            <div className='font-semibold text-6xl mt-6'>
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
                <Link  href={isAuthenticated ? "/terminal" : "/signin"} className='bg-black text-white font-semibold px-4 py-2.5 border-2 border-gray-300  rounded-full backdrop-blur-sm hover:bg-black/90'>
                  Let's Trade →
                </Link>
            </div>  

            <div className="flex items-center mt-3 backdrop-blur-sm border border-gray-300 rounded-2xl overflow-hidden">
                {stats.map((stat, index) => (
                    <React.Fragment key={stat.label}>
                        <div className="flex flex-col items-center px-8 py-3">
                            <span className="font-semibold text-xl">{stat.value}</span>
                            <span className="text-sm mt-1">{stat.label}</span>
                        </div>
                    {/* divider between stats — not after last */}
                        {index < stats.length - 1 && (
                        <div className="w-px h-10 bg-gray-300" />
                    )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    )
}

export default Hero