import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Cart from './Pages/Cart'
import Collection from './Pages/Collection'
import Login from './Pages/Login'
import Order from './Pages/Order'
import PlaceOrder from './Pages/PlaceOrder'
import Product from './Pages/Product'
import Profile from './Pages/Profile'
import Contact from './Pages/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactPixel from 'react-facebook-pixel'

const NotFound = () => (
  <div className='flex flex-col items-center justify-center min-h-[60vh] text-center gap-4'>
    <h1 className='text-6xl font-bold text-gray-200'>404</h1>
    <p className='text-gray-500 text-lg'>Page not found.</p>
  </div>
)

const App = () => {
  const location = useLocation()

  useEffect(() => {
    ReactPixel.pageView()
  }, [location])

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer position='top-right' autoClose={3000} />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/login' element={<Login />} />
        <Route path='/order' element={<Order />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/product/:productId/:slug' element={<Product />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
