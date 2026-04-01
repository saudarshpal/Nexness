import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between py-6 px-20 border-b border-b-gray-200 '>
        <Link href={``} className='font-ibm-plex-sherif font-semibold text-3xl cursor-pointer'>
           Nexness
        </Link>
        <div className='flex justify-around items-center space-x-10 text-md'>
            <div className='hover:text-gray-700 cursor-pointer'>
                 Home
            </div>
            <div className='hover:text-gray-700 cursor-pointer'>
                 Marketplace 
            </div>
        </div>
        <Link  href={`/signin`} className='font-semibold text-center text-white bg-black hover:bg-black/90 cursor-pointer px-8 py-2 rounded-full'>
            Login
        </Link>
    </div>
  )
}

export default Header