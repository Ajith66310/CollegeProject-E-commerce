import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [BestSeller, setBestSeller] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller)
      setBestSeller(bestProduct.slice(0, 52))
      setLoading(false)
    }
  }, [products])

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our top-selling products that customers love! From trending items to timeless classics, these bestsellers are sure to impress.
        </p>
      </div>

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
          : BestSeller.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))}
      </div>
    </div>
  )
}

export default BestSeller
