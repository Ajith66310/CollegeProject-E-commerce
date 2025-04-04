import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const PlaceOrder = () => {
  const { navigate, token, backendUrl, cartItems, setCartItems, getCartAmount, delivery_fee, products, VITE_RAZORPAY_KEY_ID } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const [isDeliverable, setIsDeliverable] = useState(null); // null = not checked, true = deliverable, false = not deliverable

  const onChangeHandler = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    // Allow only numeric input for the zipcode field
    if (name === "zipcode") {
      value = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    }
    setFormData((data) => ({ ...data, [name]: value }));
  };


  const initPay = (order) => {
    const options = {
      key: VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            navigate('/orders')
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error)

        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!token) {
        handleUnauthorizedUser();
        return;
      }

      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.quantity = item;
              itemInfo.productQuantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });

          if (response.status === 401 || response.data.message === "User removed. Please sign up again.") {
            handleUnauthorizedUser();
            return;
          }

          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          }
          break;
        }
        case 'razorpay': {
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } });

          if (responseRazorpay.status === 401 || responseRazorpay.data.message === "User removed. Please sign up again.") {
            handleUnauthorizedUser();
            return;
          }

          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
        }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        handleUnauthorizedUser();
      } else {
        toast.error("Your account has been removed. Please sign up again.", {
          autoClose: 3000,
          onClose: () => navigate("/login"),
        });
      }
    }
  };

  const validateZipcode = async () => {
    try {

      const response = await axios.post("http://localhost:4000/api/order/validate-zipcode", {
        zipcode: formData.zipcode,
      });

      if (response.data.success) {
        setIsDeliverable(true);
      } else {
        setIsDeliverable(false);
      }
    } catch (error) {
      console.error("Error validating zipcode:", error);
      toast.error("Error validating zipcode");
      setIsDeliverable(false);
    }
  };

  // Trigger `validateZipcode` when `formData.zipcode` changes and has 6 digits
  useEffect(() => {
    if (formData.zipcode.length === 6) {
      validateZipcode();
    }
  }, [formData.zipcode]);

  const handleUnauthorizedUser = () => {
    toast.error("Your account has been removed. Please sign up again.", {
      autoClose: 3000
    });

    localStorage.removeItem("token");

    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 3000);
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4  pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/*---------- LEFT SIDE ---------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Zipcode"
          />
          {isDeliverable === false && (
            <p className="text-red-500 text-sm mt-1">Not Deliverable. Please change the zipcode.</p>
          )}
          {isDeliverable === true && (
            <p className="text-green-500 text-sm mt-1">Deliverable</p>
          )}
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
      {/* ---------------Right side---------------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ---------------------payment method -------------- */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5  h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''} `}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div> */}
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5  h-3.5 border rounded-full  ${method === 'razorpay' ? 'bg-green-400' : ''} `}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5  h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button
              type="submit"
              className={`bg-black text-white px-16 py-3 text-sm ${isDeliverable === false ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isDeliverable === false}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder