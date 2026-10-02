import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { ShopContext } from '../context/ShopContext';

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Toggle category filter
  const toggleCategory = (e) => {
    const val = e.target.value;
    if (category.includes(val)) {
      setCategory(prev => prev.filter(item => item !== val));
    } else {
      setCategory(prev => [...prev, val]);
    }
    setCurrentPage(1);
  };

  // Toggle subCategory filter
  const toggleSubCategory = (e) => {
    const val = e.target.value;
    if (subCategory.includes(val)) {
      setSubCategory(prev => prev.filter(item => item !== val));
    } else {
      setSubCategory(prev => [...prev, val]);
    }
    setCurrentPage(1);
  };

  // Apply filters, search & sort
  useEffect(() => {
    let temp = [...products];

    if (category.length > 0) {
      temp = temp.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      temp = temp.filter(item => subCategory.includes(item.subCategory));
    }

    if (search && search.trim() !== '') {
      temp = temp.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (sortType === 'low-high') {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      temp.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(temp);
  }, [products, category, subCategory, search, sortType]);

  // Pagination calculations
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filterProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Section */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=''
          />
        </p>

        {/* Categories (Clothing & Jewelry) */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Women'
                checked={category.includes('Women')}
                onChange={toggleCategory}
              />
              Women's Wear
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Men'
                checked={category.includes('Men')}
                onChange={toggleCategory}
              />
              Men's Wear
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Kids'
                checked={category.includes('Kids')}
                onChange={toggleCategory}
              />
              Kids' Wear
            </label>
            <label className='flex items-center gap-2 cursor-pointer '>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Jewelry'
                checked={category.includes('Jewelry')}
                onChange={toggleCategory}
              />
              
              Jewelry & Accessories

            </label>
          </div>
        </div>

        {/* SubCategories / Type */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>COLLECTION TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='text-xs font-semibold text-gray-400 uppercase mt-1'>Apparel</p>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Topwear'
                checked={subCategory.includes('Topwear')}
                onChange={toggleSubCategory}
              />
              Topwear
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Bottomwear'
                checked={subCategory.includes('Bottomwear')}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Winterwear'
                checked={subCategory.includes('Winterwear')}
                onChange={toggleSubCategory}
              />
              Winterwear
            </label>

            <p className='text-xs font-semibold text-gray-400 uppercase mt-2'>Jewelry</p>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Necklace'
                checked={subCategory.includes('Necklace')}
                onChange={toggleSubCategory}
              />
              Necklaces & Pendants
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Ring'
                checked={subCategory.includes('Ring')}
                onChange={toggleSubCategory}
              />
              Rings & Bands
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Earrings'
                checked={subCategory.includes('Earrings')}
                onChange={toggleSubCategory}
              />
              Earrings
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                className='w-3.5 h-3.5 accent-black'
                type='checkbox'
                value='Bracelet'
                checked={subCategory.includes('Bracelet')}
                onChange={toggleSubCategory}
              />
              Bracelets & Bangles
            </label>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-400 hidden sm:inline'>({filterProducts.length} items)</span>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className='border-2 border-gray-300 text-sm px-2 py-1 rounded'
            >
              <option value='relevant'>Sort by: Relevant</option>
              <option value='low-high'>Price: Low to High</option>
              <option value='high-low'>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                slug={item.slug}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <div className='col-span-full py-16 text-center text-gray-400'>
              <p className='text-base font-medium text-gray-500'>No products found matching your filters.</p>
              <button
                onClick={() => { setCategory([]); setSubCategory([]); }}
                className='mt-3 text-xs underline text-black'
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-10 flex-wrap gap-4 border-t pt-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>Showing</span>
              <span>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filterProducts.length)}</span>
              <span>of {filterProducts.length} products</span>
            </div>

            <div className='flex items-center gap-2'>
              <button
                className='px-3 py-1 border rounded disabled:opacity-40 text-sm hover:bg-gray-50'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className='text-sm px-2'>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className='px-3 py-1 border rounded disabled:opacity-40 text-sm hover:bg-gray-50'
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
