import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'> 
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-gray-600 px-6 sm:px-0'>
          <div className='flex gap-2 items-center'>
            <p className='w-8 md:w-11 h-[2px] bg-gray-700'></p>
            <p className='font-medium text-xs md:text-sm tracking-wider uppercase'>PREMIUM APPAREL & JEWELRY</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed text-gray-900'>
            New Season Styles
          </h1>
          <Link to='/collection' className='inline-flex items-center gap-2 cursor-pointer group mt-2'>
            <p className='font-semibold text-sm md:text-base text-gray-900 group-hover:underline'>EXPLORE COLLECTION</p>
            <p className='w-8 md:w-11 h-[2px] bg-gray-700 group-hover:w-14 transition-all'></p>
          </Link>
        </div>
      </div>
      <img className='w-full sm:w-1/2 object-cover max-h-[480px]' src={assets.hero_img} alt='Hero Banner' />
    </div>
  )
}

export default Hero
