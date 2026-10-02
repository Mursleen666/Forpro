import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { Link } from 'react-router-dom'

const Order = () => {
  const { currency, token, userOrdersList, fetchUserOrders, cancelOrderCOD } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setLoading(true)
      fetchUserOrders().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  if (!token) {
    return (
      <div className='border-t pt-16 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-medium text-gray-800'>Track & View Your Orders</h2>
        <p className='text-gray-500 max-w-md'>Please log in to your account to review your past orders, delivery tracking, and order history.</p>
        <Link to='/login' className='bg-black text-white px-8 py-2.5 text-sm rounded hover:bg-gray-800 transition'>
          Log In to Account
        </Link>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-600'
      case 'Out for delivery':
      case 'Shipped':
        return 'bg-blue-600'
      case 'Packing':
        return 'bg-amber-500'
      case 'Cancelled':
        return 'bg-red-600'
      default:
        return 'bg-emerald-500'
    }
  }

  return (
    <div className='border-t pt-16 min-h-[70vh]'>
      <div className='flex justify-between items-center mb-6'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <button
          onClick={() => {
            setLoading(true)
            fetchUserOrders().finally(() => setLoading(false))
          }}
          className='text-xs sm:text-sm px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-1.5'
        >
          <span>↻</span> Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className='text-center py-20 text-gray-400'>Loading your orders...</div>
      ) : userOrdersList.length === 0 ? (
        <div className='text-center py-20 flex flex-col items-center gap-4'>
          <p className='text-gray-500 text-lg'>You have not placed any orders yet.</p>
          <Link to='/collection' className='bg-black text-white px-6 py-2.5 text-sm rounded'>
            Explore Collections & Shop
          </Link>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {userOrdersList.map((order, orderIdx) => {
            const orderDate = new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={order._id || orderIdx}
                className='border rounded-lg p-5 bg-white shadow-sm flex flex-col gap-4'
              >
                {/* Header: Order ID & Meta */}
                <div className='flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs sm:text-sm text-gray-600'>
                  <div>
                    <span className='font-semibold text-gray-900'>Order ID:</span> #{order._id?.slice(-8).toUpperCase()}
                    <span className='mx-2'>•</span>
                    <span>Placed on {orderDate}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-gray-900'>Payment:</span>
                    <span className='px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-medium'>
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${order.payment ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.payment ? 'Paid' : 'Unpaid (Due at Delivery)'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className='flex flex-col gap-4 divide-y'>
                  {order.items?.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className='pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
                    >
                      <div className='flex items-start gap-4'>
                        <img
                          className='w-16 h-20 object-cover rounded border'
                          src={item.image || assets.upload_area}
                          alt={item.name}
                        />
                        <div>
                          <p className='font-medium text-gray-900 sm:text-base'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1.5 text-sm text-gray-600'>
                            <p className='font-semibold text-gray-900'>{currency}{item.price}</p>
                            <span>Quantity: {item.quantity}</span>
                            {item.size && (
                              <span className='px-2 py-0.5 bg-gray-100 border text-xs rounded'>
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='text-sm text-right w-full sm:w-auto font-medium'>
                        Subtotal: {currency}{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer: Delivery Address, Status & Actions */}
                <div className='border-t pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/60 -mx-5 -mb-5 p-5 rounded-b-lg'>
                  <div className='text-xs sm:text-sm text-gray-600'>
                    <p className='font-semibold text-gray-800 mb-0.5'>Delivery Address:</p>
                    <p>
                      {order.address?.firstName} {order.address?.lastName} • {order.address?.phone}
                    </p>
                    <p>
                      {order.address?.street}, {order.address?.city}{order.address?.state ? `, ${order.address?.state}` : ''} {order.address?.zipcode}
                    </p>
                  </div>

                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></span>
                      <span className='text-sm font-semibold text-gray-800 tracking-wide'>
                        {order.status}
                      </span>
                    </div>

                    <div className='flex items-center gap-3 text-sm'>
                      <div className='text-right'>
                        <span className='text-xs text-gray-500'>Order Total:</span>
                        <p className='text-lg font-bold text-gray-900'>{currency}{order.amount}</p>
                      </div>

                      {order.status === 'Order Placed' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              cancelOrderCOD(order._id)
                            }
                          }}
                          className='text-xs border border-red-300 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition'
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Order
