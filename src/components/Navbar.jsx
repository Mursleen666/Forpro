import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { setShowSearch, getCartCount, token, userProfile, logout, navigate } = useContext(ShopContext)
  const location = useLocation()

  const isCollectionPage = location.pathname.toLowerCase().includes('collection')

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo} alt='Logo' className='w-36' />
      </Link>

      <ul className='hidden sm:flex gap-6 text-sm text-gray-700 tracking-wide'>
        <NavLink to='/' className='flex flex-col items-center gap-1 hover:text-black'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:text-black'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1 hover:text-black'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1 hover:text-black'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        {isCollectionPage && (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt='Search'
            className='w-5 cursor-pointer hover:opacity-75 transition'
          />
        )}

        <div className='group relative'>
          {token ? (
            <div className='flex items-center gap-2 cursor-pointer py-1'>
              <div className='w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase'>
                {userProfile?.name ? userProfile.name[0] : 'U'}
              </div>
            </div>
          ) : (
            <Link to='/login'>
              <img className='w-5 cursor-pointer hover:opacity-75' src={assets.profile_icon} alt='Login' />
            </Link>
          )}

          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-3 z-30'>
            <div className='flex flex-col gap-2 w-44 py-3 px-4 bg-white border shadow-lg text-gray-600 rounded-md text-sm'>
              {token ? (
                <>
                  <div className='border-b pb-2 text-xs'>
                    <p className='font-semibold text-gray-900 truncate'>{userProfile?.name || 'Customer'}</p>
                    <p className='text-gray-400 truncate'>{userProfile?.email}</p>
                  </div>
                  <p onClick={() => navigate('/profile')} className='hover:text-black cursor-pointer py-1'>
                    My Profile & Address
                  </p>
                  <p onClick={() => navigate('/order')} className='hover:text-black cursor-pointer py-1'>
                    My Orders
                  </p>
                  <hr className='border-gray-100 my-0.5' />
                  <p onClick={logout} className='hover:text-red-600 text-red-500 cursor-pointer py-1 font-medium'>
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <p onClick={() => navigate('/login')} className='hover:text-black cursor-pointer py-1 font-medium'>
                    Sign In / Register
                  </p>
                  <p onClick={() => navigate('/order')} className='hover:text-black cursor-pointer py-1 text-gray-400'>
                    Track Orders
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <NavLink to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='Cart' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] font-semibold'>
            {getCartCount()}
          </p>
        </NavLink>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt='Menu'
        />
      </div>

      {/* Mobile Drawer */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 shadow-2xl ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600 text-base'>
          <div onClick={() => setVisible(false)} className='cursor-pointer flex items-center gap-4 p-4 border-b font-medium'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='Back' />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b' to='/contact'>CONTACT</NavLink>
          {token ? (
            <>
              <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b font-medium text-black' to='/profile'>MY PROFILE</NavLink>
              <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b font-medium text-black' to='/order'>MY ORDERS</NavLink>
              <p onClick={() => { setVisible(false); logout() }} className='py-3 pl-6 border-b text-red-500 font-medium cursor-pointer'>LOGOUT</p>
            </>
          ) : (
            <NavLink onClick={() => setVisible(false)} className='py-3 pl-6 border-b font-medium text-black' to='/login'>SIGN IN / REGISTER</NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
