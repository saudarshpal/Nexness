import Link from 'next/link'
import React from 'react'

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
            <Link href={``} className='font-semibold text-white bg-black px-6 py-3 border border-black rounded-full'>
               Get Started →
            </Link>
            <Link href={``} className='font-semibold px-6 py-3 border border-black rounded-full'>
               Terminal →
            </Link>

        </div>



    </section>
  )
}

export default Hero