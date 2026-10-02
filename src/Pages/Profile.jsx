import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { token, userProfile, updateUserProfileData, userOrdersList, logout, navigate } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        street: userProfile.street || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        zipcode: userProfile.zipcode || '',
        country: userProfile.country || ''
      })
    }
  }, [userProfile])

  if (!token) {
    return (
      <div className='border-t pt-16 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-medium text-gray-800'>Customer Account</h2>
        <p className='text-gray-500 max-w-md'>Sign in to access your personal profile, saved shipping addresses, and order history.</p>
        <Link to='/login' className='bg-black text-white px-8 py-2.5 text-sm rounded hover:bg-gray-800 transition'>
          Sign In / Register
        </Link>
      </div>
    )
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    await updateUserProfileData(formData)
    setSaving(false)
  }

  return (
    <div className='border-t pt-14 min-h-[75vh]'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Account Overview Card */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          <div className='border rounded-lg p-6 bg-white shadow-sm flex flex-col items-center text-center'>
            <div className='w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold uppercase mb-3 shadow'>
              {userProfile?.name ? userProfile.name[0] : 'U'}
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>{userProfile?.name || 'Customer'}</h3>
            <p className='text-sm text-gray-500'>{userProfile?.email}</p>
            {userProfile?.phone && (
              <p className='text-xs text-gray-600 mt-1'>📞 {userProfile.phone}</p>
            )}

            <div className='w-full border-t mt-5 pt-4 flex flex-col gap-2'>
              <button
                onClick={() => navigate('/order')}
                className='w-full py-2 px-4 border rounded text-sm font-medium hover:bg-gray-50 text-gray-700 flex justify-between items-center'
              >
                <span>My Orders</span>
                <span className='px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold'>
                  {userOrdersList.length}
                </span>
              </button>
              <button
                onClick={() => navigate('/cart')}
                className='w-full py-2 px-4 border rounded text-sm font-medium hover:bg-gray-50 text-gray-700 text-left'
              >
                View Shopping Cart
              </button>
              <button
                onClick={logout}
                className='w-full py-2 px-4 border border-red-200 text-red-600 rounded text-sm font-medium hover:bg-red-50 text-left mt-2'
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Order Status preview */}
          <div className='border rounded-lg p-5 bg-gray-50 text-sm'>
            <h4 className='font-semibold text-gray-800 mb-2'>Recent Activity</h4>
            {userOrdersList.length === 0 ? (
              <p className='text-gray-500 text-xs'>No recent orders placed yet.</p>
            ) : (
              <div className='flex flex-col gap-2 text-xs'>
                <p className='text-gray-700'>
                  Latest Order: <span className='font-semibold'>#{userOrdersList[0]?._id?.slice(-8).toUpperCase()}</span>
                </p>
                <p className='text-gray-600'>
                  Status: <span className='font-medium text-green-700'>{userOrdersList[0]?.status}</span>
                </p>
                <Link to='/order' className='text-black font-semibold underline mt-1'>
                  View all {userOrdersList.length} orders →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Shipping & Delivery Details */}
        <div className='lg:col-span-2'>
          <div className='border rounded-lg p-6 bg-white shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>Saved Delivery & Contact Information</h3>
            <p className='text-xs text-gray-500 mb-6'>
              These details will automatically pre-fill during checkout for faster, effortless ordering.
            </p>

            <form onSubmit={handleSaveProfile} className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Full Name *</label>
                  <input
                    required
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={onChangeHandler}
                    placeholder='Your full name'
                    className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                  />
                </div>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Phone Number</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={onChangeHandler}
                    placeholder='Mobile number'
                    className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                  />
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-gray-700 block mb-1'>Street Address</label>
                <input
                  type='text'
                  name='street'
                  value={formData.street}
                  onChange={onChangeHandler}
                  placeholder='House number, street name, apartment or suite'
                  className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={onChangeHandler}
                    placeholder='City'
                    className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                  />
                </div>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>State / Province</label>
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={onChangeHandler}
                    placeholder='State'
                    className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                  />
                </div>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Zip / Postal Code</label>
                  <input
                    type='text'
                    name='zipcode'
                    value={formData.zipcode}
                    onChange={onChangeHandler}
                    placeholder='Zipcode'
                    className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                  />
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-gray-700 block mb-1'>Country</label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={onChangeHandler}
                  placeholder='Country'
                  className='w-full border border-gray-300 rounded px-3.5 py-2 text-sm focus:outline-black'
                />
              </div>

              <div className='mt-4 flex justify-end'>
                <button
                  type='submit'
                  disabled={saving}
                  className='bg-black text-white px-8 py-2.5 text-sm font-semibold rounded hover:bg-gray-800 disabled:opacity-50 transition'
                >
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
