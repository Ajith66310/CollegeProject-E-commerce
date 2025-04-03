import userModel from "../models/userModel.js";
import Order from "../models/orderModel.js"; 
import Product from "../models/productModel.js";
import productModel from "../models/productModel.js";


export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await userModel.findByIdAndDelete(userId);


    res.status(200).json({ message: "User and related orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Fetch all Users (Admins & Regular Users)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


export const updateStockStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const product = await productModel.findByIdAndUpdate(
      id,
      { inStock: status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Stock status updated successfully", product });
  } catch (error) {
    console.error('Error:', error.message); // Debugging
    res.status(500).json({ success: false, message: "Error updating stock status", error: error.message });
  }
};