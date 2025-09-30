import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Collection = () => {
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // products from backend
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const { search } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Toggle category filter
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
    setCurrentPage(1);
  };

  // Toggle subCategory filter
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
    setCurrentPage(1);
  };

  // Fetch products from backend
 const fetchProducts = async () => {
  try {
    setLoading(true);

    const query = new URLSearchParams({
      page: currentPage,
      limit: itemsPerPage,
    });

    const res = await fetch(`${backEndUrl}/api/product/list?${query.toString()}`);
    const data = await res.json();

    if (data.success) {
      setAllProducts(data.data);       // backend gives current "page slice"
      setTotalPages(data.totalPages);  // backend handles total count
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    setLoading(false);
  }
};
;

useEffect(() => {
  fetchProducts();
}, [currentPage, itemsPerPage]);

  // Apply client-side filters, search, sort (on paginated results)
  const processedProducts = () => {
  let temp = [...allProducts];

  if (category.length > 0) {
    temp = temp.filter(item => category.includes(item.category));
  }

  if (subCategory.length > 0) {
    temp = temp.filter(item => subCategory.includes(item.subCategory));
  }

  if (search.trim() !== '') {
    temp = temp.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortType === 'low-high') {
    temp.sort((a, b) => a.price - b.price);
  } else if (sortType === 'high-low') {
    temp.sort((a, b) => b.price - a.price);
  }

  return temp;
};

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

        {/* Categories */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Men'
                onChange={toggleCategory}
              />{' '}
              Men
            </label>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Women'
                onChange={toggleCategory}
              />{' '}
              Women
            </label>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Kids'
                onChange={toggleCategory}
              />{' '}
              Kids
            </label>
          </div>
        </div>

        {/* SubCategories */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Topwear'
                onChange={toggleSubCategory}
              />{' '}
              Topwear
            </label>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Bottomwear'
                onChange={toggleSubCategory}
              />{' '}
              Bottomwear
            </label>
            <label>
              <input
                className='w-3 accent-black'
                type='checkbox'
                value='Winterwear'
                onChange={toggleSubCategory}
              />{' '}
              Winterwear
            </label>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'All'} text2={'COLLECTIONS'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Low-High</option>
            <option value='high-low'>Sort by: High-Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {loading ? (
            <p>Loading...</p>
          ) : processedProducts().length > 0 ? (
            processedProducts().map((item) => (
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
            <p>No products found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-between items-center mt-6 flex-wrap gap-4'>
          {/* Page Size Selector */}
          <div className='flex items-center gap-2 text-sm'>
            <span>Items per page:</span>
            <select
              className='border px-2 py-1 rounded text-sm'
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          {/* Prev / Next Buttons */}
          <div className='flex items-center gap-3'>
            <button
              className='px-3 py-1 border rounded disabled:opacity-50'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className='text-sm'>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              className='px-3 py-1 border rounded disabled:opacity-50'
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
