import express from "express";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

    // Calculate total products and products by category
    const productData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProducts = productData.reduce((acc, curr) => acc + curr.count, 0);

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } },
          },
          sales: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //     const salesData = await Order.aggregate([
    //   {
    //     $group: {
    //       _id: "$date",
    //       sales: { $sum: "$amount" },
    //     },
    //   },
    //   { $sort: { _id: 1 } },
    // ]);

    res.json({
      totalUsers,
      totalRevenue,
      totalProducts,
      productsByCategory: productData,
      salesData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;