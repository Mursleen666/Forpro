import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/cartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import ReactPixel from 'react-facebook-pixel'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const { getCartAmount, currency, token, userProfile, placeOrderCOD, navigate } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  // Pre-fill from user profile when available
  useEffect(() => {
    if (userProfile) {
      const names = (userProfile.name || '').split(' ')
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || names[0] || '',
        lastName: prev.lastName || names.slice(1).join(' ') || '',
        email: prev.email || userProfile.email || '',
        phone: prev.phone || userProfile.phone || '',
        street: prev.street || userProfile.street || '',
        city: prev.city || userProfile.city || '',
        state: prev.state || userProfile.state || '',
        zipcode: prev.zipcode || userProfile.zipcode || '',
        country: prev.country || userProfile.country || ''
      }))
    }
  }, [userProfile])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.info('Please log in or create an account to place your order')
      navigate('/login')
      return
    }

    if (getCartAmount() <= 0) {
      toast.error('Your cart is empty. Add products to proceed.')
      return
    }

    if (!formData.firstName || !formData.street || !formData.city || !formData.phone) {
      toast.error('Please complete all required delivery details (Name, Street, City, Phone)')
      return
    }

    if (method !== 'cod') {
      toast.info('Online payment is coming soon! Please use Cash on Delivery.')
      setMethod('cod')
      return
    }

    try {
      setLoading(true)
      ReactPixel.track('Purchase', {
        value: getCartAmount(),
        currency: currency === '$' ? 'USD' : currency,
        contents: [{ id: 'cart-items', quantity: 1 }],
        content_type: 'product',
        payment_method: 'COD',
      })

      const res = await placeOrderCOD(formData)
      if (!res.success) {
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePlaceOrder} className='flex flex-col sm:flex-row justify-between gap-6 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Delivery Info */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {!token && (
          <div className='p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded'>
            Already have an account? <span onClick={() => navigate('/login')} className='font-semibold underline cursor-pointer'>Sign In</span> to auto-fill your delivery info.
          </div>
        )}

        <div className='flex gap-3'>
          <input
            required
            name='firstName'
            onChange={onChangeHandler}
            value={formData.firstName}
            type='text'
            placeholder='First name *'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
          <input
            name='lastName'
            onChange={onChangeHandler}
            value={formData.lastName}
            type='text'
            placeholder='Last name'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
        </div>
        <input
          required
          name='email'
          onChange={onChangeHandler}
          value={formData.email}
          type='email'
          placeholder='Email address *'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
        />
        <input
          required
          name='street'
          onChange={onChangeHandler}
          value={formData.street}
          type='text'
          placeholder='Street address (House / Apartment / Area) *'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
        />
        <div className='flex gap-3'>
          <input
            required
            name='city'
            onChange={onChangeHandler}
            value={formData.city}
            type='text'
            placeholder='City *'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
          <input
            name='state'
            onChange={onChangeHandler}
            value={formData.state}
            type='text'
            placeholder='State / Province'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
        </div>
        <div className='flex gap-3'>
          <input
            name='zipcode'
            onChange={onChangeHandler}
            value={formData.zipcode}
            type='text'
            placeholder='Zip / Postal Code'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
          <input
            name='country'
            onChange={onChangeHandler}
            value={formData.country}
            type='text'
            placeholder='Country'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
          />
        </div>
        <input
          required
          name='phone'
          onChange={onChangeHandler}
          value={formData.phone}
          type='tel'
          placeholder='Phone number (for delivery confirmation) *'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-black'
        />
      </div>

      {/* Order Summary & Payment */}
      <div className='mt-8 w-full sm:max-w-[480px]'>
        <div className='min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex gap-3 flex-col mt-4'>
            {/* Cash on Delivery (ACTIVE) */}
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center justify-between border-2 p-3 px-4 cursor-pointer rounded transition-all ${
                method === 'cod' ? 'border-green-600 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center gap-3'>
                <p className={`min-w-4 h-4 border-2 rounded-full flex items-center justify-center ${method === 'cod' ? 'border-green-600' : 'border-gray-300'}`}>
                  {method === 'cod' && <span className='w-2 h-2 rounded-full bg-green-600'></span>}
                </p>
                <p className='text-gray-800 text-sm font-semibold'>CASH ON DELIVERY (COD)</p>
              </div>
              <span className='text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-800 rounded'>Available Now</span>
            </div>

            {/* Stripe (Coming Soon) */}
            <div
              onClick={() => {
                toast.info('Online Card Payment via Stripe is coming soon! Please use Cash on Delivery.')
              }}
              className='relative flex items-center justify-between border border-dashed border-gray-300 p-3 px-4 bg-gray-50/70 opacity-75 cursor-not-allowed rounded'
            >
              <div className='flex items-center gap-3'>
                <p className='min-w-4 h-4 border border-gray-300 rounded-full' />
                <img className='h-5 mx-2' src={assets.stripe_logo} alt='Stripe' />
                <span className='text-xs text-gray-500 hidden sm:inline'>Credit / Debit Card</span>
              </div>
              <span className='text-[11px] font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase'>
                Coming Soon
              </span>
            </div>

            {/* Razorpay (Coming Soon) */}
            <div
              onClick={() => {
                toast.info('Online Payment via Razorpay is coming soon! Please use Cash on Delivery.')
              }}
              className='relative flex items-center justify-between border border-dashed border-gray-300 p-3 px-4 bg-gray-50/70 opacity-75 cursor-not-allowed rounded'
            >
              <div className='flex items-center gap-3'>
                <p className='min-w-4 h-4 border border-gray-300 rounded-full' />
                <img className='h-5 mx-2' src={assets.razorpay_logo} alt='Razorpay' />
                <span className='text-xs text-gray-500 hidden sm:inline'>Netbanking / UPI</span>
              </div>
              <span className='text-[11px] font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase'>
                Coming Soon
              </span>
            </div>

            <p className='text-xs text-gray-500 italic mt-1'>
              * Online payment methods are currently being integrated and will be available soon. Please choose <b>Cash on Delivery</b> to complete your order today.
            </p>
          </div>

          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              disabled={loading}
              className='bg-black text-white px-16 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all rounded-sm'
            >
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER (COD)'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
