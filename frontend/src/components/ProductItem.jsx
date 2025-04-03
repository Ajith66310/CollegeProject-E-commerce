import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id,image,name,price}) => {
  
  const {currency} = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
    <div className='overflow-hidden'>
      <img  className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
    </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className=' text-sm text-black font-medium'>{currency}{price}</p>
      {/* <button className='flex justify-center items-center text-center w-full bg-black text-white px-8 py-3 text-sm active:bg-gray-700 '>BUY NOW</button> */}
    </Link>
  )
}

export default ProductItem