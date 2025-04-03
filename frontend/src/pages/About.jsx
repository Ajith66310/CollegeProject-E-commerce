import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Welcome to Lakshmi, where tradition meets innovation. Since 2004, we have been dedicated to providing our customers with high-quality products that enhance their lives.
            Our commitment to excellence has made us a trusted name in the industry.
          </p>
          <p>
            At Lakshmi, we believe in building lasting relationships with our customers by offering products with good quality.
            Our journey is fueled by a passion for quality and a desire to exceed expectations.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            Our mission is to deliver exceptional value to our customers by offering products that inspire trust and satisfaction.
            We strive to innovate and adapt to the changing needs of our customers while staying true to our core values of quality and integrity.
          </p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className='flex flex-col md:flex-row text:sm mb-20'>
        <div className='border-none px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            We take pride in offering products that meet the highest standards of quality. Each item is carefully crafted and thoroughly inspected to ensure it meets your expectations.
          </p>
        </div>
        <div className='border-none px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            Shopping with us is easy and hassle-free. Our user-friendly platform and efficient delivery services ensure that you get what you need, when you need it.
          </p>
        </div>
        <div className='border-none px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>
            Our dedicated customer service team is here to assist you every step of the way. We value your feedback and are committed to ensuring your satisfaction.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About