import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart,} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [productQuantity, setProductQuantity] = useState(1); // Number of units

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0]);
        return null;
      }
    })
  }
  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = async () => {
    if (!productData || !productData._id) {
      return toast("Product data not loaded yet");
    }
    if (!reviewText.trim()) return toast("Review cannot be empty");

    try {
      const res = await fetch(`http://localhost:4000/api/product/${productData._id}/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          review: reviewText
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewText(" ");
        // Refetch product data to get updated reviews
        window.location.reload();
        fetchProductData();
      } else {
        toast(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      toast("Error submitting review");
    }
  };

  useEffect(() => {
    if (productData && productData.stock <= 0) {
      setProductQuantity(0); // Disable quantity input when stock is 0
    }
  }, [productData]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>
        {/* ------------Product Info ------------------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2' >
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>({productData.reviews?.length || 0})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>



          {/* Quantity (Weight/Gram) Selection */}
          <div className='mt-5'>
            <label htmlFor="size" className='block text-sm font-medium mb-2'>Weight/Size</label>
            <div className='flex gap-2'>
              {productData.quantity.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-green-500' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Product Quantity (Number of Units) Input */}
          <div className='mt-5 mb-2'>
            <label htmlFor="productQuantity" className='block text-sm font-medium mb-2'>Units</label>
            <input
              id="productQuantity"
              type="number"
              min={1}
              max={productData.stock}
              value={productData.stock > 0 ? productQuantity : 0}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
              className='border px-3 py-2 w-20'
              placeholder="1"
              disabled={productData.stock <= 0}
            />
          </div>

          <div className='mt-5'>
            <p className={`text-sm font-medium ${productData.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {productData.stock > 0 ? `In Stock (${productData.stock}) ` : 'Out of Stock'}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (!size) {
                toast.error("Please select a weight/size before adding to cart.");
                return;
              }
              if (productQuantity < 1) {
                toast.error("Please enter a valid number of units.");
                return;
              }
              addToCart(productData._id, size, productQuantity);
              navigate('/cart'); 
            }}
            className={`px-8 py-3 text-sm text-white ${productData.stock > 0 ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={productData.stock <= 0}
          >
            {productData.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy.</p>
          </div>
        </div>
      </div>
   
      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex border-b'>
          <p className='px-5 py-3 text-sm font-medium border-b-2 border-black'>Description</p>
          <p className='px-5 py-3 text-sm text-gray-600'>Reviews ({productData.reviews?.length || 0})</p>
        </div>

        <div className='border px-6 py-6 text-sm text-gray-700'>
          <p className='mb-2'>{productData.description}</p>
        </div>

        {/* Reviews Section */}
        <div className='mt-10'>
          <h2 className='text-xl font-semibold mb-4'>Customer Reviews</h2>

          {/* Review List */}
          {productData.reviews?.length > 0 ? (
            <div className='flex flex-col gap-5'>
              {productData.reviews.map((review, index) => (
                <div key={index} className='bg-gray-100 p-4 rounded-lg'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='font-medium'>{review.username}</p>
                    <span className='text-xs text-gray-500'>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className='text-sm text-gray-800'>{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Add Review Form (Only if user is logged in) */}
        {localStorage.getItem("token") && (
          <div className='mt-10'>
            <h3 className='text-lg font-medium mb-2'>Write a Review</h3>
            <textarea
              className='w-full p-3 border rounded-md text-sm outline-none focus:ring-1 focus:ring-black'
              rows={4}
              placeholder='Share your thoughts...'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              onClick={handleSubmitReview}
              className='mt-3 bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800'
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* --------Display Related Products------- */}
      <RelatedProducts category={productData.category} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product