import React from 'react'
import {Routes,Route} from 'react-router-dom'
//import Home from './pages/Home'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Login from './pages/Login'
import Order from './pages/Order'
import Contact from './pages/Contact'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const App = () => {
  return (
   
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar/>
      <SearchBar />
     <Routes>
     <Route path='/' element={<Home/>} />
     <Route path='/About' element={<About/>} />
     <Route path='/Cart' element={<Cart/>}/>
     <Route path='/Collection' element={<Collection/>}/>
     <Route path='/Login' element={<Login/>} />
     <Route path='/Order' element={<Order/>} />
     <Route path='/PlaceOrder' element={<PlaceOrder/>}/>
      {/* Old pattern: only productId */}
  <Route path='/product/:productId' element={<Product/>}/>

  {/* New pattern: productId + slug */}
  <Route path="/product/:productId/:slug?" element={<Product />} />

     <Route path='/Contact' element={<Contact/>}/>
     
      

     </Routes>
     <Footer/> 
    </div>
 
  )
}

export default App
