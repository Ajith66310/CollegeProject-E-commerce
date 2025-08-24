# 🛒 MERN Stack E-Commerce Website

This is a full-featured E-Commerce application built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. It includes user authentication, product management, cart, checkout, admin panel, and analytics features.

## 🚀 Features

### 👥 User Features
- User registration & login (JWT-based)
- View latest products
- View best selling products
- Add products to cart
- Checkout with order confirmation
- Order cancellation (within 1 hour)
- Product reviews & ratings
- View order history
- Product search & filters (by category, price etc.)
- Secure online payment via Razorpay
- Delivery eligibility check (restrict orders outside 5 km radius)

### 🛠 Admin Features
- Admin authentication
- Product CRUD (Create, Read, Update, Delete)
- User management
- Order management & status tracking
- Product stock management (in stock / out of stock)
- Sales & analytics dashboard
- Review moderation (remove inappropriate reviews)

## 🧱 Tech Stack

### 💻 Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Rest API
- Context API (state management)

### 🌐 Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- Nodemailer (for order/email notifications)

### 📦 Other Tools
- Vite (for fast frontend bundling)
- ESLint + Prettier
- Git & GitHub for version control
- Dotenv for environment variables
  
**📂 Project Structure**
<pre>
  
COLLEGEPROJECT-E-COMMERCE/
│
├── admin/                     # Admin Panel (React + Vite)
│   └── src/
│       ├── assets/            # Static files like images, icons, logos
│       ├── components/        # Reusable UI components (Navbar, Sidebar, Login, etc.)
│       ├── pages/             # Different admin pages (Product CRUD, Orders, Analytics)
│
├── backend/                   # Backend (Node.js + Express + MongoDB)
│   ├── config/                # Database connection & environment config
│   ├── controllers/           # Request handlers (business logic for routes)
│   ├── middleware/            # Custom middleware (auth, error handling, validation)
│   ├── models/                # Mongoose models (User, Product, Order schemas)
│   ├── routes/                # API endpoints (user, product, order, auth, etc.)
│   ├── templates/             # Email templates for Nodemailer
│   └── utils/                 # Helper functions (JWT, email, validators, etc.)
│
├── frontend/                  # User Frontend (React + Vite)
│   └── src/
│       ├── assets/            # Static files like images, banners, icons
│       ├── components/        # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│       ├── context/           # Context API for global state management
│       └── pages/             # Different user pages (Home, Cart, Checkout, Orders, etc.)
│
└── README.md                  # Project documentation

</pre>

**Run the Application**

**Frontend Setup**

<pre>
cd frontend 
npm install
npm run dev
</pre>

**Backend Setup**

<pre>
cd backend 
npm install
npm run server
</pre>

Create a **.env** file inside **backend/**:

<pre>
PORT=YOUR_PORT_NUMBER
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_SECRET_KEY=YOUR_CLOUDINARY_SECRET_KEY
CLOUDINARY_NAME=YOUR_CLOUDINARY_NAME
JWT_SECRET=YOUR_JWT_SECRET
ADMIN_EMAIL=YOUR_EMAIL/ADMIN
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
EMAIL_USER=YOUR_APP_EMAIL
EMAIL_PASS=YOUR_APP_EMAIL_PASSWORD
</pre>

**Admin Setup**

<pre>
cd admin 
npm install
npm run dev
</pre>

Create a **.env** file inside **admin/**:

<pre>
VITE_BACKEND_URL=YOUR_BACKEND_URL
</pre>

🌐 **Live Demo**  
🔗 [Live Demo](https://lakshmi-project-frontend.vercel.app/)
