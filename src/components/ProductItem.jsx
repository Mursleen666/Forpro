import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({ id, slug, image, name, price }) => {
  const { currency } = useContext(ShopContext)
  const imgSrc = Array.isArray(image) ? image[0] : image || assets.upload_area

  return (
    <Link
      to={slug ? `/product/${id}/${slug}` : `/product/${id}`}
      className='text-gray-700 cursor-pointer group flex flex-col justify-between'
    >
      <div className='overflow-hidden rounded bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center'>
        <img
          className='w-full h-full object-cover group-hover:scale-105 transition-all duration-300'
          src={imgSrc}
          alt={name}
        />
      </div>
      <div className='pt-2.5 flex flex-col flex-grow justify-between'>
        <p className='text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug'>{name}</p>
        <p className='text-sm sm:text-base font-bold text-gray-900 mt-1'>
          {currency}{price}
        </p>
      </div>
    </Link>
  )
}

export default ProductItem
