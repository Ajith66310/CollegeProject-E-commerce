import Product from "../models/productModel.js"; 
import ejs from "ejs";
import path from "path"; 
import { fileURLToPath } from "url"; 
import { dirname } from "path"; 
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

const sendInvoiceEmail = async (userEmail, userName, order) => {
  try {
    console.log(" Fetching Order Items...");
    console.log(" Order Data:", JSON.stringify(order, null, 2));

    if (!order.items || order.items.length === 0) {
      console.error(" ERROR: Order has no items");
      return;
    }

    const orderItems = await Promise.all(
      order.items.map(async (item) => {
        console.log(" Processing Item:", item);

        if (!item._id) {
          console.error(" ERROR: Missing _id in order item", item);
          return { name: "Unknown Product", price: 0, quantity: item.productQuantity || 1 };
        }

        console.log(" Fetching product with ID:", item._id);
        const product = await Product.findById(item._id);

        if (!product) {
          console.error(` ERROR: Product not found for ID: ${item._id}`);
          return { name: "Unknown Product", price: 0, quantity: item.productQuantity || 1 };
        }

        console.log(" Product Found:", product.name, "Price:", product.price);

        return {
          name: product.name,
          price: item.price ?? product.price , // Use product price if not available in order
          quantity: item.productQuantity || 1,
        };
      })
    );

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    console.log("Final Order Items:", orderItems);
    console.log("Total Amount Calculated:", totalAmount);

    // Render EJS Template
    const emailHtml = await ejs.renderFile(
      path.join(__dirname, "../templates/invoice.ejs"),
      { userName, order: { ...order, items: orderItems, totalAmount } }
    );

    // Send Email
    await transporter.sendMail({
      from: "ajith66310@gmail.com",
      to: userEmail,
      subject: `Invoice - Order #${order._id}`,
      html: emailHtml,
    });

    console.log(`Email sent successfully to: ${userEmail}`);
  } catch (error) {
    console.error("ERROR in sending email:", error);
  }
};

export default sendInvoiceEmail;
