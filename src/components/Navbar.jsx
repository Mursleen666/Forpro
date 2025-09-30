import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { setShowSearch, getCartCount } = useContext(ShopContext)
  const location = useLocation()

  const isCollectionPage = location.pathname.includes('collection') // ✅ Check if on collection page

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to="/"> 
        <img src={assets.logo} alt="Logo" className='w-36' />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        {/* ✅ Search icon only visible on collection page */}
        {isCollectionPage && (
          <img 
            onClick={() => setShowSearch(true)} 
            src={assets.search_icon} 
            alt="Search" 
            className='w-5 cursor-pointer' 
          />
        )}

        <div className='group relative'>
          <Link to='/login'>
            <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile" />
          </Link>

          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='hover:text-black cursor-pointer'>My Profile</p>
              <p className='hover:text-black cursor-pointer'>Order</p>
              <p className='hover:text-black cursor-pointer'>Layout</p>
            </div>
          </div>
        </div>

        <NavLink to='/cart' className="relative">
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </NavLink>

        <img 
          onClick={() => setVisible(true)} 
          src={assets.menu_icon} 
          className='w-5 cursor-pointer sm:hidden' 
          alt="Menu" 
        />
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='cursor-pointer flex items-center gap-4 p-3'>
            <img className='h4 rotate-180' src={assets.dropdown_icon} alt="Back" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="hover:text-gray-500 py-2 pl-6 border" to="/">HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className="hover:text-gray-500 py-2 pl-6 border" to="/collection">COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className="hover:text-gray-500 py-2 pl-6 border" to="/about">ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className="hover:text-gray-500 py-2 pl-6 border" to="/contact">CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
