import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const {userId, itemId, quantity,productQuantity} = req.body;
    const userData = await userModel.findById(userId);
    const product = await productModel.findById(itemId)
    
    // Ensure userData is valid
    if (!userData) {
      return res.json({success: false, message: "User not found"});
    }

    let cartData = userData.cartData || {}; // Ensure cartData exists

    // Ensure cartData[itemId] is an object
    if (typeof cartData[itemId] !== "object") {
      cartData[itemId] = {}; // Initialize as an empty object
    }

    // Calculate the total quantity of the product in the cart
    let totalInCart = 0;
    if (cartData[itemId]) {
      for (const size in cartData[itemId]) {
        totalInCart += cartData[itemId][size];
      }
    }

    // Check if adding the new quantity exceeds the available stock
    if (totalInCart + productQuantity > product.stock) {
      return res.json({success: false, message: "Not enough stock available."});
    }

    // Add or update quantity
    cartData[itemId][quantity] = (cartData[itemId][quantity] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, {cartData});
    res.json({success: true, message: "Added To Cart"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// update  user cart
const updateCart = async (req, res) => {
  try {
    const {userId, itemId, quantity, productQuantity} = req.body;
    const userData = await userModel.findById(userId);
    const product = await productModel.findById(itemId);

    if (!userData) {
      return res.json({success: false, message: "User not found"});
    }
    if (!product) {
      return res.json({success: false, message: "Product not found"});
    }

    if (productQuantity > product.stock) {
      return res.json({success: false, message: "Not enough stock available."});
    }

    let cartData = userData.cartData || {};
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][quantity] = productQuantity;

    await userModel.findByIdAndUpdate(userId, {cartData});
    res.json({success: true, message: "Cart Updated"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

const getUserCart = async (req, res) => {
  try {
    const {userId} = req.body;
    const userData = (await userModel.findById(userId)) || " ";
    let cartData = (await userData.cartData) || {};
    res.json({success: true, cartData});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

export {addToCart, updateCart, getUserCart};
