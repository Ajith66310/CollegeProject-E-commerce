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


const allowedOrigins = [
  "http://localhost:5173",  // local frontend
  "http://localhost:5174",  // local admin
  "https://lakshmi-project-frontend.vercel.app", // production frontend
  "https://lakshmi-project-admin.vercel.app"     // production admin
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "Accept", "X-Requested-With"],
  credentials: true
}));


app.options("*", cors());


// ✅ Body parser after CORS
app.use(express.json());

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// ✅ Export for Vercel (serverless)
export default serverless(app);

// ✅ Local dev only
if (!process.env.VERCEL) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server started on port: ${port}`));
}
