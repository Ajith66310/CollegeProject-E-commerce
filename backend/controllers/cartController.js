import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const {userId, itemId, quantity} = req.body;
    const userData = await userModel.findById(userId);

    // Ensure userData is valid
    if (!userData) {
      return res.json({success: false, message: "User not found"});
    }

    let cartData = userData.cartData || {}; // Ensure cartData exists

    // Ensure cartData[itemId] is an object
    if (typeof cartData[itemId] !== "object") {
      cartData[itemId] = {}; // Initialize as an empty object
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
    let cartData = await userData.cartData;
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
