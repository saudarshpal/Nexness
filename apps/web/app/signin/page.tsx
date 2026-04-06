"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Signin = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signinMutation } = useAuth();

    const handleSubmit = async(e : React.FormEvent) =>{
        e.preventDefault();
        try {
            await signinMutation.mutateAsync({email,password});
            router.push('/');
        }catch(err){
            console.log("Signup Error");
        }
    }
    
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
                        <h1 className='text-3xl font-semibold'> Welcome Back </h1>
                        <p className='italic text-gray-700 text-md mt-3 '> Good to See You Again, Pick Up Where You Left Off </p>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-4'>

                        <div>
                            <label className='block text-sm mb-2'>Email</label>
                            <input
                                type='text'
                                onChange={(e)=> setEmail(e.target.value)}
                                className='w-full px-4 py-2 border-2 border-black rounded-lg outline-none'
                                placeholder='Enter your name'
                            />
                        </div>

                        <div>
                            <label className='block text-sm mb-2'>Password</label>
                            <input
                                type='text'
                                onChange={(e)=> setPassword(e.target.value)}
                                className='w-full px-4 py-2 border-2 border-black rounded-lg outline-none'
                                placeholder='Enter your name'
                            />
                        </div>

                        <button  type='submit' className='w-full bg-black text-white font-semibold rounded-lg px-4 py-3 mt-4'>
                            Sign In
                        </button>

                    </form>

                    <span className='block text-sm mt-6 text-center'>
                        Don't have an account? <Link href={`/signup`} className='underline'> Create one</Link>
                    </span>

                    <Link href={`/`} className=' block text-sm underline text-center mt-6'>  
                        ← Back to Home
                    </Link>
                    
                </div>
                
            </div>
        </div>
        
        </main>
    )
}

export default Signin