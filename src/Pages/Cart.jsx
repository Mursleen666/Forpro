import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/cartTotal'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { currency, products, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    const temp = []
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          temp.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          })
        }
      }
    }
    setCartData(temp)
  }, [cartItems])

  return (
    <div className='border-t pt-14 min-h-[70vh]'>
      <div className='text-2xl mb-4'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-20 flex flex-col items-center gap-4'>
          <p className='text-gray-500 text-lg'>Your shopping cart is currently empty.</p>
          <Link to='/collection' className='bg-black text-white px-8 py-3 text-sm rounded font-medium hover:bg-gray-800 transition'>
            Explore Clothing & Jewelry
          </Link>
        </div>
      ) : (
        <>
          <div className='divide-y'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id)
              if (!productData) return null
              const imgSrc = Array.isArray(productData.image) ? productData.image[0] : productData.image || assets.upload_area

              return (
                <div
                  key={index}
                  className='py-4 text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                >
                  <div className='flex items-start gap-4 sm:gap-6'>
                    <img
                      className='w-16 sm:w-20 object-cover rounded border'
                      src={imgSrc}
                      alt={productData.name}
                    />
                    <div>
                      <p className='text-xs sm:text-base font-semibold text-gray-900'>{productData.name}</p>
                      <div className='flex items-center gap-4 mt-1.5'>
                        <p className='text-sm sm:text-base font-bold text-gray-900'>{currency}{productData.price}</p>
                        {item.size && (
                          <span className='px-2 py-0.5 border bg-gray-100 text-xs rounded text-gray-700'>
                            {item.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-center sm:justify-start'>
                    <input
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        if (val >= 1) updateQuantity(item._id, item.size, val)
                      }}
                      className='border rounded w-12 sm:w-16 px-2 py-1 text-center text-sm focus:outline-black'
                      type='number'
                      min={1}
                      max={50}
                      defaultValue={item.quantity}
                    />
                  </div>

                  <div className='text-right'>
                    <img
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className='w-4 sm:w-5 cursor-pointer opacity-70 hover:opacity-100 ml-auto'
                      src={assets.bin_icon}
                      alt='Remove'
                      title='Remove from cart'
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className='flex justify-end my-16'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end mt-6'>
                <button
                  onClick={() => navigate('/placeorder')}
                  className='bg-black text-white text-sm px-10 py-3.5 font-semibold hover:bg-gray-800 transition rounded-sm shadow'
                >
                  PROCEED TO CHECKOUT (COD)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
