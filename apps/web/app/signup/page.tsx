"use client"
import Image from 'next/image'
import Link from 'next/link'

const Signup = () => {
  return (
    <main className="relative min-h-screen ">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-chart.png"
          alt='home page background'
          fill 
          className='object-cover opacity-20 blur-[1px]'
          priority
           />
      </div>

      <div className='relative z-10 '>
        <div className='flex justify-center items-center px-4' >
            <div className='max-w-md w-full mx-auto '>
                <div className='text-center mb-4 mt-12'>
                    <h1 className='text-3xl font-semibold'> Get Started </h1>
                    <p className='italic text-gray-700 text-md mt-3 '> Join the club and begin your trading journey </p>
                </div>
                <form className='space-y-4'>

                    <div>
                        <label className='block text-sm mb-2'>Full Name</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border-2 border-black rounded-lg outline-none'
                            placeholder='Enter your name'
                        />
                    </div>

                     <div>
                        <label className='block text-sm mb-2'>Email</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border-2 border-black rounded-lg outline-none'
                            placeholder='Enter your name'
                        />
                    </div>

                     <div>
                        <label className='block text-sm mb-2'>Password</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border-2 border-black rounded-lg outline-none'
                            placeholder='Enter your name'
                        />
                    </div>

                    <button className='w-full bg-black text-white font-semibold rounded-lg px-4 py-3 mt-4 '>
                        Create Account
                    </button>

                </form>

                <span className='block text-sm mt-6 text-center'>
                     Already have an account? <Link href={`/signin`} className='underline'> Signin</Link>
                </span>

                <Link href={`/`} className=' block text-sm underline text-center mt-6'>  
                     ← Back to Home
                </Link>

                <div className="mt-6 text-center">

                    <p className="text-xs text-gray-600 font-dm-sans leading-relaxed">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>

                </div>
                
            </div>
            
        </div>
    </div>
      
    </main>
  )
}

export default Signup