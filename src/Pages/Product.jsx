import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import ReactPixel from 'react-facebook-pixel'
import { toast } from 'react-toastify'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart, backEndUrl, userProfile, addProductReview } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [size, setSize] = useState('')
  const [image, setImage] = useState('')
  const [activeTab, setActiveTab] = useState('description') // 'description' or 'reviews'

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Match product from context
  useEffect(() => {
    const found = products.find((item) => item._id === productId)
    if (found) {
      setProductData(found)
      setImage(Array.isArray(found.image) ? found.image[0] : found.image)
    }
  }, [productId, products])

  // Pre-fill reviewer name if user is logged in
  useEffect(() => {
    if (userProfile?.name && !reviewName) {
      setReviewName(userProfile.name)
    }
  }, [userProfile])

  // Fetch from backend directly to get freshest reviews
  const fetchFreshProduct = async () => {
    try {
      const res = await fetch(`${backEndUrl}/api/product/${productId}`)
      const data = await res.json()
      if (data.success && (data.product || data.singProduct)) {
        const prod = data.product || data.singProduct
        setProductData(prod)
        const img = prod.image
        setImage(Array.isArray(img) ? img[0] : img)
      }
    } catch (err) {
      console.error('Error fetching product:', err)
    }
  }

  useEffect(() => {
    if (productId) fetchFreshProduct()
  }, [productId, backEndUrl])

  // Fire ViewContent pixel event
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

  const handleAddToCart = () => {
    const sizes = Array.isArray(productData.sizes) ? productData.sizes : []
    if (sizes.length > 0 && !size) {
      toast.error('Please select a size before adding to cart.')
      return
    }
    addToCart(productData._id, size || 'Standard')
    ReactPixel.track('AddToCart', {
      content_name: productData.name,
      content_category: productData.category,
      value: productData.price,
      currency: 'USD',
    })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error('Please enter your name and review comment')
      return
    }
    setSubmittingReview(true)
    const res = await addProductReview(productData._id, reviewRating, reviewComment, reviewName)
    setSubmittingReview(false)
    if (res.success) {
      setReviewComment('')
      // Update local reviews list
      if (res.reviews) {
        setProductData(prev => ({ ...prev, reviews: res.reviews }))
      } else {
        fetchFreshProduct()
      }
    }
  }

  if (!productData) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-400 text-lg'>Loading product...</p>
      </div>
    )
  }

  const images = Array.isArray(productData.image) ? productData.image : [productData.image]
  const sizes = Array.isArray(productData.sizes) ? productData.sizes : []
  const reviews = Array.isArray(productData.reviews) ? productData.reviews : []

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 flex-col sm:flex-row'>
        {/* Image Gallery */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2'>
            {images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[23%] sm:w-full object-cover cursor-pointer border rounded ${item === image ? 'border-black' : 'border-gray-200'}`}
                alt={productData.name}
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto object-cover rounded border' src={image} alt={productData.name} />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded uppercase tracking-wider'>
              {productData.category}
            </span>
            {productData.subCategory && (
              <span className='text-xs font-medium px-2 py-0.5 bg-gray-50 text-gray-500 rounded uppercase'>
                {productData.subCategory}
              </span>
            )}
            {productData.bestSeller && (
              <span className='text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded'>
                ★ Best Seller
              </span>
            )}
          </div>

          <h1 className='font-semibold text-2xl sm:text-3xl mt-2 text-gray-900'>{productData.name}</h1>

          {/* Rating overview */}
          <div className='flex items-center gap-2 mt-3 cursor-pointer' onClick={() => setActiveTab('reviews')}>
            <div className='flex items-center text-amber-500 text-lg'>
              {'★'.repeat(Math.round(Number(averageRating)))}
              <span className='text-gray-300'>{'★'.repeat(5 - Math.round(Number(averageRating)))}</span>
            </div>
            <p className='text-sm text-gray-600 font-medium'>
              {averageRating} <span className='text-gray-400'>({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </p>
          </div>

          <p className='mt-5 text-3xl font-bold text-gray-900'>
            {currency}{productData.price}
          </p>
          <p className='mt-4 text-gray-600 leading-relaxed md:w-4/5'>{productData.description}</p>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className='flex flex-col gap-3 my-6'>
              <p className='text-sm font-semibold text-gray-800'>
                Select Size: <span className='text-gray-500 font-normal'>{size || 'None selected'}</span>
              </p>
              <div className='flex gap-2 flex-wrap'>
                {sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 rounded text-sm transition-all ${
                      item === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500'
                    }`}
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mt-8'>
            <button
              onClick={handleAddToCart}
              className='px-10 py-3.5 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 active:bg-gray-700 transition rounded-sm shadow-sm'
            >
              ADD TO CART
            </button>
          </div>

          <hr className='mt-8 sm:w-4/5' />

          {/* Value props */}
          <div className='text-sm text-gray-600 mt-5 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>100% Original Authentic Product</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Cash on delivery available nationwide</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Easy 7-day return and exchange policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs */}
      <div className='mt-20'>
        <div className='flex border-b'>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'description'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-sm font-semibold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <span>Customer Reviews</span>
            <span className='px-2 py-0.5 text-xs bg-gray-100 rounded-full font-medium'>
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Content: Description */}
        {activeTab === 'description' && (
          <div className='py-8 text-gray-700 leading-relaxed text-sm flex flex-col gap-4 max-w-4xl'>
            <p>{productData.description}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-5 bg-gray-50 rounded border'>
              <div>
                <p className='font-semibold text-gray-900'>Product Highlights:</p>
                <ul className='list-disc list-inside mt-2 text-gray-600 space-y-1'>
                  <li>Category: {productData.category}</li>
                  <li>Type: {productData.subCategory || 'Standard collection'}</li>
                  <li>Premium handcrafted finish and stitching</li>
                  <li>Skin-friendly materials suitable for everyday wear</li>
                </ul>
              </div>
              <div>
                <p className='font-semibold text-gray-900'>Care & Shipping:</p>
                <ul className='list-disc list-inside mt-2 text-gray-600 space-y-1'>
                  <li>Dispatched within 24-48 business hours</li>
                  <li>Pay when package arrives via Cash on Delivery</li>
                  <li>Store in a clean, moisture-free environment</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === 'reviews' && (
          <div className='py-8 flex flex-col lg:flex-row gap-10'>
            {/* Reviews List */}
            <div className='flex-1 flex flex-col gap-6'>
              <div className='flex items-center justify-between border-b pb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Verified Customer Feedback</h3>
                  <p className='text-xs text-gray-500 mt-0.5'>Average rating: {averageRating} / 5 based on {reviews.length} reviews</p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className='p-8 text-center bg-gray-50 rounded border text-gray-500'>
                  <p className='text-base font-medium'>No reviews yet for this product.</p>
                  <p className='text-xs text-gray-400 mt-1'>Be the first customer to share your experience!</p>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {reviews.map((rev, idx) => {
                    const reviewDate = rev.date
                      ? new Date(rev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'Recent'
                    return (
                      <div key={idx} className='border rounded p-4 bg-white shadow-sm flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2.5'>
                            <div className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase'>
                              {rev.userName ? rev.userName[0] : 'U'}
                            </div>
                            <div>
                              <p className='text-sm font-semibold text-gray-900'>{rev.userName}</p>
                              <div className='text-amber-500 text-xs'>
                                {'★'.repeat(rev.rating || 5)}
                                <span className='text-gray-300'>{'★'.repeat(5 - (rev.rating || 5))}</span>
                              </div>
                            </div>
                          </div>
                          <span className='text-xs text-gray-400'>{reviewDate}</span>
                        </div>
                        <p className='text-sm text-gray-700 mt-1 pl-10'>{rev.comment}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className='w-full lg:w-[420px] bg-gray-50 p-6 rounded-lg border h-fit'>
              <h4 className='text-base font-semibold text-gray-900 mb-1'>Write a Review</h4>
              <p className='text-xs text-gray-500 mb-4'>Share your thoughts about this product with other shoppers.</p>

              <form onSubmit={handleSubmitReview} className='flex flex-col gap-3'>
                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Overall Rating</label>
                  <div className='flex items-center gap-1 text-2xl cursor-pointer'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={star <= reviewRating ? 'text-amber-500' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                    <span className='text-xs text-gray-600 ml-2 font-medium'>{reviewRating} out of 5</span>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Your Name</label>
                  <input
                    required
                    type='text'
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder='e.g. Sarah Jenkins'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-black bg-white'
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold text-gray-700 block mb-1'>Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder='What did you like or dislike about the fit, quality, or material?'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-black bg-white'
                  />
                </div>

                <button
                  type='submit'
                  disabled={submittingReview}
                  className='w-full bg-black text-white py-2.5 text-sm font-semibold rounded hover:bg-gray-800 disabled:opacity-50 transition mt-2'
                >
                  {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  )
}

export default Product
