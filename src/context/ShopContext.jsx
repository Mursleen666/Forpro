import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const backEndUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const ShopContextProvider = (props) => {
  const currency = '$'
  const deliveryFee = 10
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [userProfile, setUserProfile] = useState(null)
  const [userOrdersList, setUserOrdersList] = useState([])
  const navigate = useNavigate()

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = async (itemId, size) => {
    const itemInfo = products.find((p) => p._id === itemId)
    // If product has sizes defined and not selected
    if (itemInfo && itemInfo.sizes && itemInfo.sizes.length > 0 && !size) {
      toast.error('Please select a product size')
      return
    }
    const finalSize = size || 'Standard'

    const cartData = structuredClone(cartItems)
    if (cartData[itemId]) {
      if (cartData[itemId][finalSize]) {
        cartData[itemId][finalSize] += 1
      } else {
        cartData[itemId][finalSize] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][finalSize] = 1
    }
    setCartItems(cartData)
    toast.success('Item added to cart')
  }

  const getCartCount = () => {
    let totalCount = 0
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item]
          }
        } catch (_) {}
      }
    }
    return totalCount
  }

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems)
    if (quantity <= 0) {
      delete cartData[itemId][size]
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]
      }
    } else {
      cartData[itemId][size] = quantity
    }
    setCartItems(cartData)
  }

  const clearCart = () => {
    setCartItems({})
    localStorage.removeItem('cartItems')
  }

  const getCartAmount = () => {
    let totalAmount = 0
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items)
      if (!itemInfo) continue
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch (_) {}
      }
    }
    return totalAmount
  }

  const getProductData = async () => {
    try {
      const response = await axios.get(backEndUrl + '/api/product/list')
      if (response.data && response.data.data) {
        setProducts(response.data.data)
      } else {
        toast.error('Products load failed')
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Unable to connect to server')
    }
  }

  // Fetch Customer Profile
  const fetchUserProfile = async () => {
    if (!token) return
    try {
      const res = await axios.get(backEndUrl + '/api/user/profile', {
        headers: { token }
      })
      if (res.data.success) {
        setUserProfile(res.data.user)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  // Update Customer Profile
  const updateUserProfileData = async (data) => {
    if (!token) return { success: false, msg: 'Please login first' }
    try {
      const res = await axios.put(backEndUrl + '/api/user/profile', data, {
        headers: { token }
      })
      if (res.data.success) {
        setUserProfile(res.data.user)
        toast.success(res.data.msg || 'Profile updated successfully')
        return { success: true }
      } else {
        toast.error(res.data.msg || 'Profile update failed')
        return { success: false }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Error updating profile')
      return { success: false }
    }
  }

  // Fetch User Orders
  const fetchUserOrders = async () => {
    if (!token) return []
    try {
      const res = await axios.post(
        backEndUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )
      if (res.data.success) {
        setUserOrdersList(res.data.orders)
        return res.data.orders
      }
      return []
    } catch (error) {
      console.error('fetchUserOrders error:', error)
      return []
    }
  }

  // Place Order COD
  const placeOrderCOD = async (deliveryAddress) => {
    if (!token) {
      toast.error('Please login to place your order')
      navigate('/login')
      return { success: false }
    }

    const orderItems = []
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = products.find((product) => product._id === items)
          if (itemInfo) {
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              price: itemInfo.price,
              image: Array.isArray(itemInfo.image) ? itemInfo.image[0] : itemInfo.image,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error('Your cart is empty')
      return { success: false }
    }

    const totalAmount = getCartAmount() + deliveryFee

    try {
      const res = await axios.post(
        backEndUrl + '/api/order/place',
        {
          items: orderItems,
          amount: totalAmount,
          address: deliveryAddress
        },
        { headers: { token } }
      )

      if (res.data.success) {
        toast.success(res.data.msg || 'Order placed successfully!')
        clearCart()
        await fetchUserOrders()
        navigate('/order')
        return { success: true }
      } else {
        toast.error(res.data.msg || 'Order placement failed')
        return { success: false }
      }
    } catch (error) {
      console.error('placeOrderCOD error:', error)
      toast.error(error.response?.data?.msg || 'Failed to place order')
      return { success: false }
    }
  }

  // Cancel order
  const cancelOrderCOD = async (orderId) => {
    if (!token) return
    try {
      const res = await axios.post(
        backEndUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Order cancelled successfully')
        fetchUserOrders()
      } else {
        toast.error(res.data.msg || 'Unable to cancel order')
      }
    } catch (error) {
      console.error('cancelOrder error:', error)
      toast.error('Error cancelling order')
    }
  }

  // Add review
  const addProductReview = async (productId, rating, comment, userName) => {
    try {
      const res = await axios.post(backEndUrl + '/api/product/review', {
        productId,
        rating,
        comment,
        userName,
        userId: userProfile?._id || ''
      })
      if (res.data.success) {
        toast.success('Thank you for your review!')
        getProductData()
        return { success: true, reviews: res.data.reviews }
      } else {
        toast.error(res.data.msg || 'Failed to submit review')
        return { success: false }
      }
    } catch (error) {
      console.error('addReview error:', error)
      toast.error('Failed to submit review')
      return { success: false }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUserProfile(null)
    setUserOrdersList([])
    toast.info('Logged out')
    navigate('/login')
  }

  useEffect(() => {
    getProductData()
  }, [])

  useEffect(() => {
    if (token) {
      fetchUserProfile()
      fetchUserOrders()
    } else {
      setUserProfile(null)
      setUserOrdersList([])
    }
  }, [token])

  const value = {
    products,
    currency,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    clearCart,
    getCartAmount,
    navigate,
    backEndUrl,
    token,
    setToken,
    userProfile,
    updateUserProfileData,
    userOrdersList,
    fetchUserOrders,
    placeOrderCOD,
    cancelOrderCOD,
    addProductReview,
    logout
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
