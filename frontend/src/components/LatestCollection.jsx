import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10).reverse())
      setLoading(false)
    }
  }, [products])

  return (
    <div className='my-10 '>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'PRODUCTS'} />
        <p className='w-3/4 m-auto text-xs sm:text-base md:text-base text-gray-600'>
          Explore our latest collection of products, Don't miss out on these fresh arrivals!
        </p>
      </div>

      {/* Rendering products or skeleton loader */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {loading
          ? Array(10)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='animate-pulse'>
                  <div className='bg-gray-200 rounded-2xl w-full aspect-square'></div>
                  <div className='mt-3 h-3 bg-gray-200 rounded'></div>
                  <div className='mt-2 h-3 bg-gray-200 w-1/2 rounded'></div>
                </div>
              ))
          : latestProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
      </div>
    </div>
  )
}

export default LatestCollection
