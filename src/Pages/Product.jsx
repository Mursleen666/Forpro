import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import ReactPixel from 'react-facebook-pixel'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [size, setSize] = useState('')
  const [image, setImage] = useState('')
  const [slug, setSlug] = useState('')

  // ✅ 1. Fire "ViewContent" event when product is viewed
  useEffect(() => {
    if (productData) {
      ReactPixel.track('ViewContent', {
        content_name: productData.name,
        content_category: productData.category,
        value: productData.price,
        currency: 'USD',
      })
    }
  }, [productData])

  // ✅ 2. Fetch product data from backend
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}/${slug || 'undefined'}`)
        const data = await res.json()
        if (data.success) {
          setProductData(data.product)
          setImage(data.product.image[0])
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      }
    }

    fetchProductData()
  }, [productId])

  // ✅ 3. Match product from context
  useEffect(() => {
    products.map((item) => {
      if (item._id === productId) {
        setSlug(item.slug)
        setProductData(item)
        setImage(item.image[0])
      }
      return null
    })
  }, [productId, products])

  // ✅ 4. Track AddToCart when button is clicked
  const handleAddToCart = () => {
    if (!size) {
      alert('Please select a size before adding to cart.')
      return
    }

    // your existing add-to-cart logic
    addToCart(productData._id, size)

    // Facebook Pixel event
    ReactPixel.track('AddToCart', {
      content_name: productData.name,
      content_category: productData.category,
      value: productData.price,
      currency: 'USD',
    })
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product ka data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* {images} */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt=''
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt='' />
          </div>
        </div>

        {/* information of product */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2 '>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} className='w-3.5' alt='' />
            <img src={assets.star_icon} className='w-3.5' alt='' />
            <img src={assets.star_icon} className='w-3.5' alt='' />
            <img src={assets.star_icon} className='w-3.5' alt='' />
            <img src={assets.star_dull_icon} className='w-3.5' alt='' />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>
            {currency}
            {productData.price}
          </p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? 'border-gray-600 bg-gray-950 text-white' : ''
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className='px-8 py-3 bg-gray-950 text-white text-sm active:bg-gray-700'
          >
            ADD TO CART
          </button>
          <hr className='mt-8 sm:w-4/5 ' />
          <div className=' text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% original product</p>
            <p>Easy return and exchange policy</p>
            <p>Cash on delivery is free on this product</p>
          </div>
        </div>
      </div>

      {/* review */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews(122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>
            An eCommerce (electronic commerce) website is a site where people can buy and sell products or services online. Customers browse products → Add to cart → Pay online → Get products delivered. Businesses use it to showcase, sell, and manage orders. <br />
            <br />
            These websites typically include features like product listings, shopping carts, secure payment gateways, and customer accounts. With the rapid growth of digital technology, eCommerce has become a vital part of the global economy, offering convenience, a wider reach, and cost-effective solutions for both buyers and sellers.
          </p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'></div>
  )
}

export default Product
