import express from "express";
import {removeUser, getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// Remove a user by ID and orders
router.delete("/remove-user/:userId", removeUser);

// Fetch all users
router.get("/users", getAllUsers);



export default router;
