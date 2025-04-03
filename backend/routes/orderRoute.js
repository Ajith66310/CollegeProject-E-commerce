import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
  cancelOrder,
  returnOrder,
} from "../controllers/orderController.js";
// import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();
// admin Features
orderRouter.post("/list", allOrders);
orderRouter.post("/status", updateStatus);

// payment features
orderRouter.post("/place", authUser, placeOrder);

orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// user Feature
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
orderRouter.post("/cancel", cancelOrder);
orderRouter.post("/return", returnOrder);
export default orderRouter;
