import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
          Lakshmi Since 2004 - A legacy of trust, quality, and excellence. For over two decades, we have been committed to delivering the finest products to our customers.
          Our journey is built on innovation, customer satisfaction, and a passion for excellence. Explore our wide range of products, crafted to meet your needs and exceed your expectations.
          Join us in celebrating a tradition of quality and reliability that has stood the test of time.
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <NavLink to='/'>
            <li>Home</li>
            </NavLink>
            <NavLink to='/about'>
            <li>About us</li>
            </NavLink>
            <NavLink to='/orders'>
            <li>Delivery</li>
            </NavLink>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>
            GET IN TOUCH
          </p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91-6282612177</li>
            <li>ajith66310@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center '>Copyright 2025 - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer