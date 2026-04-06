"use client"
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, logoutMutation } = useAuth();
  
  return (
    <div className='flex justify-between py-6 px-20 border-b border-b-gray-200 '>
        <div className='font-ibm-plex-sherif font-semibold text-3xl cursor-pointer'>
           Nexness
        </div>
        <div className='flex justify-around items-center space-x-10 text-md'>
            <div className='hover:text-gray-700 cursor-pointer'>
                 Home
            </div>
            <Link href={'/terminal'} className='hover:text-gray-700 cursor-pointer'>
                Terminal 
            </Link>
        </div>        
        {isAuthenticated ? (
          <button 
            onClick={() => {
              logoutMutation.mutate()
              router.push('/')
            }} 
            className='font-semibold text-center text-white bg-black hover:bg-black/90 cursor-pointer px-8 py-2 rounded-full'
            >
              Logout
          </button>
        ) : (
          <Link  
            href={'/signin'} 
            className='font-semibold text-center text-white bg-black hover:bg-black/90 cursor-pointer px-8 py-2 rounded-full'
            >
              Login
          </Link>
        )}
    
       
        
    </div>
  )
}

export default Header