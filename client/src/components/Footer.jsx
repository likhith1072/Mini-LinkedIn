import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook,BsInstagram,BsTwitter,BsGithub} from 'react-icons/bs'

export default function Footer() {
  return (
        <div className=' border border-t-6 border-teal-500 dark:border-teal-600 p-5 rounded-md m-1 mx-auto'>
        <div className=' w-full max-w-8xl mx-auto px-8'>
          <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <div className='mt-5'>
              <Link to="/" className='font-bold  w-23 h-15 ml-25 md:h-18 md:w-33'>
                         <div className='flex items-center justify-center h-15 w-23 md:h-18 md:w-33'><img src="/LinkNestLogo.png" alt="Logo" className='w-full h-full object-fill rounded-lg ' /></div>
                        </Link>
            </div>
            <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 mt-4 text-gray-600 text-md'>
              <div className='flex flex-col gap-4'>
                <h2 className='text-gray-600 font-semibold '>Contact Us</h2>
                
                <p>9010385949</p>

              </div>
              <div className='flex flex-col gap-4 '>
                <h2 className='text-gray-600 font-semibold '>FOLLOW US</h2>
                 <Link to="https://github.com/likhith1072" target="_blank" rel="noopener no referrer" className='hover:underline'>GitHub</Link>
                 <Link to="https://x.com/LVarunsai" target="_blank" rel="noopener no referrer" className='hover:underline'>Twitter</Link>
              </div>
              <div className='flex flex-col gap-4 '>
                <h2 className='text-gray-600 font-semibold '>LEGAL</h2>
                 <Link to="#" target="_blank" rel="noopener no referrer" className='hover:underline'>Privacy Policy</Link>
                 <Link to="#" target="_blank" rel="noopener no referrer" className='hover:underline'>Terms & Conditions</Link>
              </div>
            </div>
          </div>
          <div className='bg-gray-100 dark:bg-gray-500 w-full h-[2px] mt-5'></div>
          <div className=' text-gray-600 flex gap-4 items-center justify-between mt-2'>   
            <div><span> &copy;{new Date().getFullYear()} LinkNest</span></div> 
            <div className='flex gap-8 items-center sm:text-xl'> <BsFacebook className=' cursor-pointer'/>
           <BsInstagram className=' cursor-pointer'/>
           <BsTwitter className=' cursor-pointer'/>
           <BsGithub className='cursor-pointer'/></div>
           
          </div>
        </div>
        </div>
  )
}
