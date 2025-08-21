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
import serverless from "serverless-http";

const app = express();
connectDB();
connectCloudinary();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // frontend
  "http://localhost:5174", // admin
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// ✅ Export for Vercel (always)
export default serverless(app);

// ✅ Run locally only if not on Vercel
if (!process.env.VERCEL) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server started on port: ${port}`));
}
