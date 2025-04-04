import sendInvoiceEmail from "../utils/emailService.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import axios from 'axios'

// global variables
const currency = "inr";
const deliveryCharge = 60;

// gateaway initialize
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// placing orders using cod method
const placeOrder = async (req, res) => {
  try {
    const {userId, items, amount, address} = req.body;

    //  Fetch User
    const user = await userModel.findById(userId);
    // Check if user exists
    if (!user) {
      return res
        .status(401)
        .json({success: false, message: "User removed. Please sign up again."});
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();

    await sendInvoiceEmail(user.email, user.name, savedOrder);

    await userModel.findByIdAndUpdate(userId, {cartData: {}});
    res.json({success: true, message: "Order Placed & Invoice Sent"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// placing orders using RazorPay mRethod

const placeOrderRazorpay = async (req, res) => {
  try {
    const {userId, items, amount, address} = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({success: false, message: "User removed. Please sign up again."});
    }
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };
    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({success: false, message: error});
      }
      res.json({success: true, order});
    });
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const {userId, razorpay_order_id} = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({success: false, message: "User removed. Please sign up again."});
    }
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const updateOrder = await orderModel.findByIdAndUpdate(
        orderInfo.receipt,
        {payment: true},
        {new: true}
      );
      await userModel.findByIdAndUpdate(userId, {cartData: {}});
      // Mail sending

      // const order = await orderModel.findById(orderInfo.receipt);
      // if (!order) {
      //   return res.status(404).json({ success: false, message: "Order not found" });
      // }
      // Fetch user details
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User removed. Please sign up again.",
        });
      }

      // Send the invoice email
      await sendInvoiceEmail(user.email, user.name, updateOrder);

      res.json({success: true, message: "Payment Successful & invoice Sent"});
    } else {
      res.json({success: false, message: "Payment Failed"});
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// All orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success: true, orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};
// user orders Data for frontend
const userOrders = async (req, res) => {
  try {
    const {userId} = req.body;
    if (!userId) {
      return res
        .status(401)
        .json({success: false, message: "User removed. Please sign up again."});
    }
    const orders = await orderModel.find({userId});
    res.json({success: true, orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};
// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const {orderId, status} = req.body;
    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({success: true, message: "Status Updated"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

//  Create Order & Send Invoice
const createOrder = async (req, res) => {
  try {
    const {userId, items, amount, address, paymentMethod} = req.body;

    //  Find the User
    const user = await userModel.findById(userId);

    //  Save Order to Database
    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
      paymentMethod,
      status: "Order Placed",
      payment: true, //  payment is successful
      date: Date.now(),
    });

    const savedOrder = await newOrder.save();

    // Send Email Invoice
    await sendInvoiceEmail(user.email, user.name, savedOrder);

    res
      .status(201)
      .json({success: true, message: "Order placed & invoice sent!"});
  } catch (error) {
    console.error(" Order Error:", error);
    res.status(500).json({success: false, message: "Order failed"});
  }
};

// Cancel Order (Only if not shipped)
const cancelOrder = async (req, res) => {
  try {
    const {orderId} = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({success: false, message: "Order ID is required"});
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({success: false, message: "Order not found"});
    }

    if (
      order.status.toLowerCase() === "shipped" ||
      order.status.toLowerCase() === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order already shipped or delivered. Cannot be canceled.",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({success: true, message: "Order cancelled successfully!"});
  } catch (error) {
    console.error("Error cancelling order:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Return Order (Only if delivered and not perishable)
const returnOrder = async (req, res) => {
  try {
    const {orderId} = req.body;
    if (!orderId) {
      return res.status(400).json({message: "Order ID is required"});
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({message: "Order not found"});
    }

    if (order.status === "Delivered") {
      order.status = "Return Requested";
      await order.save();
      return res.status(200).json({success: true, message: "Return requested"});
    } else {
      return res
        .status(400)
        .json({message: "Only delivered orders can be returned"});
    }
  } catch (error) {
    console.error("Return order error:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};


const STORE_LOCATION = {lat: 10.677166521491214, lng: 76.09256569292494}; // Example: Store's latitude and longitude (Bangalore)

const validateZipcode = async (req, res) => {
  const { zipcode } = req.body;

  try {
    if (!zipcode) {
      return res.status(400).json({ success: false, message: "Zipcode is required" });
    }

    console.log("Validating zipcode:", zipcode);

    // Use OpenCage API to get the latitude and longitude of the entered zipcode
    const geoResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${zipcode}&key=ec1196b22e674c55b000400e028f164c`
    );

    if (geoResponse.data.results.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Zipcode" });
    }

    const { lat, lng } = geoResponse.data.results[0].geometry;

    console.log("Coordinates:", { lat, lng });

    // Calculate the distance between the store and the entered zipcode
    const distance = calculateDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);

    console.log("Distance:", distance);

    if (distance > 10) {
      return res.json({ success: false, message: "Not Deliverable" });
    }

    res.json({ success: true, message: "Deliverable" });
  } catch (error) {
    console.error("Error in validateZipcode:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Helper function to calculate the distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

export {
  validateZipcode,
  returnOrder,
  cancelOrder,
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
  createOrder,
};
