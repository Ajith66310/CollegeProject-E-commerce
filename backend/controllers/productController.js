import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';


//  function for add product
const addProduct = async (req, res) => {
  try {
    const {name, description, price, category, quantity, bestseller,stock,expiryDate,} = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      bestseller: bestseller === "true" ? true : false,
      quantity: JSON.parse(quantity),
      image: imagesUrl,
      date: Date.now(),
      stock: Number(stock),
      expiryDate,
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    res.json({success: true, message: "Product Added"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

//  function for list product

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({success: true, products});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

//  function for remove product

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({success: true, message: "Prouct Removed"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

//  function for single product info

const singleProduct = async (req, res) => {
  try {
    const {productId} = req.body;
    const product = await productModel.findById(productId);
    res.json({success: true, product});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};
// addd review
 const addReview = async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const userId = decoded.id;

    const { review } = req.body;
    const { productId } = req.params; 
    if (!productId || !review) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Get user's name 
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found. Please Login...!" });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      userId,
      username: user.name,
      review,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(200).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.body;
    if (!productId || !reviewId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Remove review by ID
    product.reviews = product.reviews.filter(review => review._id.toString() !== reviewId);
    await product.save();

    res.status(200).json({ message: "Review removed successfully" });
  } catch (error) {
    console.error("Error removing review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const { id, price, stock, expiryDate, quantity, bestseller } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { price, stock, expiryDate, quantity, bestseller },
      { new: true }
    );
    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {updateProduct,removeReview,addReview,listProducts, addProduct, removeProduct, singleProduct};
