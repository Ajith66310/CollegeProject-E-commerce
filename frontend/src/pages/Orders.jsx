import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])
  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await axios.post(`${import.meta.env.backendUrl}/api/order/userorders`, {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id;
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }
  useEffect(() => {
    loadOrderData()
    const interval = setInterval(loadOrderData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [token])

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(`${import.meta.env.backendUrl}/api/order/cancel`, { orderId }, { headers: { token } });
      if (response.data.success) {
        loadOrderData(); // Refresh orders after cancellation
        toast.success('Product cancelled Successfully')
      }
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleReturnOrder = async (orderId) => {
    try {
      const response = await axios.post(`${import.meta.env.backendUrl}/api/order/return`, { orderId }, { headers: { token } });
      console.log(response)
      if (response.data.success) {
        loadOrderData(); // Refresh orders after return request
        toast.success('Product pick up in a hour')
      }
    } catch (error) {
      console.error('Error returning order:', error);
    }
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p className='text-lg'>{currency}{item.price}</p>
                    <p>Quantity:{item.productQuantity}</p>
                    <p>Size:{item.quantity}</p>
                  </div>
                  <p className='mt-1'>Date:<span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment:<span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                {item.status !== "Shipped" && item.status !== "Return Requested" && item.status !== "Cancelled" && item.status !== "Delivered" && (
                  <button
                    onClick={() => handleCancelOrder(item.orderId)}
                    className="border font-bold py-1 px-3 rounded transition duration-300"
                    style={{
                      backgroundColor: "#ffebf5",
                      borderColor: "#C586A5",
                      color: "#C586A5",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#a0567d";
                      e.target.style.color = "#a0567d";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#C586A5";
                      e.target.style.color = "#C586A5";
                    }}>
                    Cancel
                  </button>
                )}
                {/* Return Button (Only if status is "Delivered" and NOT Fruits or Vegetables) */}
                {item.status !== "Shipped" && item.status !== "Return Requested" && item.status !== "Cancelled" && item.status !== "Order Placed" && item.category !== "Fruits" && item.category !== "Vegetables" && (
                  <button
                    onClick={() => handleReturnOrder(item.orderId)}
                    className="border font-bold py-1 px-3 rounded transition duration-300"
                    style={{
                      backgroundColor: "#E6F0FF", // Light Blue
                      borderColor: "#4A90E2", // Primary Blue
                      color: "#4A90E2",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#276FBF"; // Darker Blue on Hover
                      e.target.style.color = "#276FBF";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#4A90E2"; // Revert to Primary Blue
                      e.target.style.color = "#4A90E2";
                    }}
                  >
                    Return
                  </button>
                )}

              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders