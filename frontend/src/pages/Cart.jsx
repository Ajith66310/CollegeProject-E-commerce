import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, setProducts } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              quantity: item,
              productQuantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])


  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to proceed to checkout.", { autoClose: 3000 });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      return false;
    }
    return true;
  };

  const onCheckout = () => {
    // Check if user is authenticated
    if (!checkAuth()) return;

    // Check if cart is empty
    const isCartEmpty = cartData.length === 0;
    if (isCartEmpty) {
      toast.error("Your cart is empty", { autoClose: 3000 });

      // Redirect to shop page after 3 seconds
      setTimeout(() => {
        navigate("/shop");
      }, 3000);
      return;
    }

    // Navigate to checkout if cart is not empty
    navigate('/place-order');
  };


  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item._id)

            return (
              <div key={index} className='py-4 border-b border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-5'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.quantity}</p>
                    </div>
                  </div>
                </div>
                <p className='border text-center w-5'>{item.productQuantity}</p>
                <img
                  onClick={() => {
                    const productData = products.find((product) => product._id === item._id);
                    if (productData) {
                      // Update stock in ShopContext
                      const updatedProducts = products.map((product) =>
                        product._id === item._id
                          ? { ...product, stock: product.stock + item.productQuantity }
                          : product
                      );
                      setProducts(updatedProducts); // Update products in ShopContext

                      // Remove the product from the cart
                      updateQuantity(item._id, item.quantity, 0);
                    }
                  }}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            )
          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />

          <div className='w-full text-end'>
            <button onClick={onCheckout} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart