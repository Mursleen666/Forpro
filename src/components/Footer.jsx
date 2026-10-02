import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='my-10 mt-32 text-sm'>
      <div className='flex flex-col grid-cols-[3fr_1fr_1fr] sm:grid gap-14 my-10 text-sm'>
        <div>
          <img className='mb-5 w-36' src={assets.logo} alt='Brand Logo' />
          <p className='w-full text-gray-600 md:w-4/5 leading-relaxed'>
            Your premier destination for timeless clothing and handcrafted designer jewelry. Every piece is crafted with uncompromising quality, delivered directly to your doorstep with convenient Cash on Delivery nationwide.
          </p>
          <div className='mt-4 flex items-center gap-3 text-xs text-gray-500 font-medium'>
            <span className='px-2 py-1 bg-gray-100 rounded'>🚚 Nationwide COD Available</span>
            <span className='px-2 py-1 bg-gray-100 rounded'>💎 100% Certified Authentic</span>
          </div>
        </div>

        <div>
          <p className='text-base font-semibold mb-4 text-gray-900'>COMPANY & SHOP</p>
          <ul className='text-gray-600 gap-2 flex flex-col'>
            <li><Link to='/' className='hover:text-black'>Home</Link></li>
            <li><Link to='/collection' className='hover:text-black'>All Collections (Clothing & Jewelry)</Link></li>
            <li><Link to='/about' className='hover:text-black'>About Us</Link></li>
            <li><Link to='/order' className='hover:text-black'>Track Orders</Link></li>
            <li><Link to='/contact' className='hover:text-black'>Delivery & Returns</Link></li>
          </ul>
        </div>

        <div>
          <p className='text-base font-semibold mb-4 text-gray-900'>CUSTOMER SUPPORT</p>
          <ul className='text-gray-600 gap-2.5 flex flex-col'>
            <li className='flex items-center gap-2'>
              <span>📞</span> <span>+1 (800) 555-0199</span>
            </li>
            <li className='flex items-center gap-2'>
              <span>✉</span> <span>support@foreverstore.com</span>
            </li>
            <li className='text-xs text-gray-500 mt-1'>
              Customer service available Monday – Saturday, 9am – 8pm.
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2'>
        <p>© 2026 Forever Store. All rights reserved.</p>
        <p>Cash on Delivery Supported • Online Payments (Coming Soon)</p>
      </div>
    </div>
  )
}

export default Footer
