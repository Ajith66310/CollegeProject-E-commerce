import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FaList, FaChartBar, FaUsers, FaStar } from 'react-icons/fa' // Import icons from react-icons

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-400'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/add">
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block' >Add Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
          <FaList className='w-5 h-5' />
          <p className='hidden md:block' >List Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/orders">
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block' >Orders</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/analytics">
          <FaChartBar className='w-5 h-5' />
          <p className='hidden md:block' >Analytics</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/admin">
          <FaUsers className='w-5 h-5' />
          <p className='hidden md:block' >Users</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/adminreview">
          <FaStar className='w-5 h-5' />
          <p className='hidden md:block' >Reviews</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar