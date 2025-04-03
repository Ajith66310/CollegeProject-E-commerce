import express from "express";
import {  updateStockStatus,removeUser, getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// Remove a user by ID and orders
router.delete("/remove-user/:userId", removeUser);

// Fetch all users
router.get("/users", getAllUsers);

router.post('/product/update-stock', updateStockStatus);

export default router;
