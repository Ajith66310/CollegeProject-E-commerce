import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = () => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {})
      if (response.data) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: event.target.value });
      if (response.data.success) {
        // Instantly update the UI without waiting for next polling
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchAllOrders()
    const interval = setInterval(fetchAllOrders, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  },[])
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200  p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              {/* <img
                className="w-12"
                src={order.items[0]?.image[0] || assets.parcel_icon} //first product's image or parcel icon
                alt={order.items[0]?.name || "Product Image"}
              /> */}
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index} >{item.name} : {item.productQuantity} <span>{item.quantity}</span></p>
                    } else {
                      return <p className='py-0.5' key={index} >{item.name} : {item.productQuantity} <span>{item.quantity}</span>,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + " , " + order.address.state + " , " + order.address.country + " , " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]' >Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

              {/* Status Dropdown */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className={`p-2 font-semibold rounded 
                  ${order.status === 'Return Requested' ? 'text-blue-600 border-blue-600' : ''}
                  ${order.status === 'Cancelled' ? 'text-red-600 border-red-600' : ''}
                  border`}
                disabled={order.status === 'Return Requested' || order.status === 'Cancelled'}
              >
                {/* Prevent changing status for Cancelled or Returned Orders */}
                {!(order.status === 'Return Requested' || order.status === 'Cancelled') ? (
                  <>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </>
                ) : (
                  <option value={order.status}>{order.status}</option>
                )}

              </select>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders