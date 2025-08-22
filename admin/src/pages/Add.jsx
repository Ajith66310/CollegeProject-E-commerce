import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [bestseller, setBestseller] = useState(false);
  const [quantity, setQuantity] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [stock, setStock] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("bestseller", bestseller)
      formData.append("quantity", JSON.stringify(quantity))
      formData.append("expiryDate", expiryDate)
      formData.append("stock", stock);
      
      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setExpiryDate('');
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Spices">Spices</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Softdrinks</option>
            <option value="Icecream">Icecream</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
        </div>
      </div>
      <div>
        <p className='mb-2' >Product Sizes</p>
        <div className='flex gap-3'>
          <div onClick={() => setQuantity(prev => prev.includes("73g") ? prev.filter(item => item !== "73g") : [...prev, "73g"])}>
            <p className={`${quantity.includes("73g") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>73g</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("250g") ? prev.filter(item => item !== "250g") : [...prev, "250g"])}>
            <p className={`${quantity.includes("250g") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>250g</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("500g") ? prev.filter(item => item !== "500g") : [...prev, "500g"])}>
            <p className={`${quantity.includes("500g") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>500g</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("1kg") ? prev.filter(item => item !== "1kg") : [...prev, "1kg"])}>
            <p className={`${quantity.includes("1kg") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>1kg</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("250ml") ? prev.filter(item => item !== "250ml") : [...prev, "250ml"])}>
            <p className={`${quantity.includes("250ml") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>250ml</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("330ml") ? prev.filter(item => item !== "330ml") : [...prev, "330ml"])}>
            <p className={`${quantity.includes("330ml") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>330ml</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("500ml") ? prev.filter(item => item !== "500ml") : [...prev, "500ml"])}>
            <p className={`${quantity.includes("500ml") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>500ml</p>
          </div>
          <div onClick={() => setQuantity(prev => prev.includes("1pack") ? prev.filter(item => item !== "1pack") : [...prev, "1pack"])}>
            <p className={`${quantity.includes("1pack") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>1pack</p>
          </div>
        </div>
      </div>
      {/* New Stock Input Field */}
      <div>
        <p className='mb-2'>Product Stock</p>
        <input
          onChange={(e) => setStock(e.target.value)}
          value={stock}
          className='w-full px-3 py-2 sm:w-[120px]'
          type="number"
          placeholder='Enter stock quantity'
          required
        />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Expiry Date</p>
        <input onChange={(e) => setExpiryDate(e.target.value)} value={expiryDate} className='w-full max-w-[500px] px-3 py-2' type="date" required />
      </div>
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white '>ADD</button>
    </form>
  )
}

export default Add