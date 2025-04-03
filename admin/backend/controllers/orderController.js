import sendInvoiceEmail from "../utils/emailService.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
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
         return res.status(401).json({ success: false, message: "User removed. Please sign up again." });
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
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
     const updateOrder =  await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true},{new:true});
     await userModel.findByIdAndUpdate(userId, {cartData:{}});
      // Mail sending 
      
      // const order = await orderModel.findById(orderInfo.receipt);
      // if (!order) {
      //   return res.status(404).json({ success: false, message: "Order not found" });
      // }
      // Fetch user details
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(401).json({ success: false, message: "User removed. Please sign up again." });
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
      return res.status(401).json({ success: false, message: "User removed. Please sign up again." });
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

export {
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
  createOrder,
};
