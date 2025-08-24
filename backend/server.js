import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Connect DB + Cloudinary
connectDB();
connectCloudinary();

//  Allowed origins for local + production
const allowedOrigins = [
  "https://lakshmi-project-frontend.vercel.app", // production frontend
  "https://lakshmi-project-admin.vercel.app",     // production admin
  "https://lakshmi-project-backend.vercel.app",     // production admin
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "token","auth-token"],
  credentials: true
}));

// Handle preflight
app.options("*", cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Local run
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server started on port: ${port}`));
}

// Export for Vercel
export default app;
