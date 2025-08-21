import bcrypt from "bcryptjs";import validator from "validator";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET);
};

// routes for user login
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User doesn't exists"});
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({success: true, token});
    }else{
      res.json({success:false,message:'Invalid credentials'})
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// routes for user register
const registerUser = async (req, res) => {
  try {
    const {name, password} = req.body;
    let {email} =req.body;

     // Check if the email contains uppercase letters
     const uppercaseRegex = /[A-Z]/;
     if (uppercaseRegex.test(email)) {
       return res.json({
         success: false,
         message: "Email must not contain uppercase letters",
       });
     }

     // Convert email to lowercase
     email = email.toLowerCase();

     // Regular expression to validate email format (must end with @gmail.com)
     const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
 
     // Check if the email matches the required format
     if (!emailRegex.test(email)) {
       return res.json({
         success: false,
         message: "Email must end with @gmail.com",
       });
     }

    // checking user already exist /not
    const exists = await userModel.findOne({email});
    if (exists) {
      return res.json({success: false, message: "User already exists"});
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Please enter a valid email"});
    }

    // Regular expression for strong password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long and include at least one letter, one number, and one symbol",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({success: true, token});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// route for admin login
const adminLogin = async (req, res) => {
  try {
    const {email,password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
     const token = jwt.sign({ email }, process.env.JWT_SECRET, );
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid credentials"})
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Regular expression for strong password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long and include at least one letter, one number, and one symbol",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {loginUser, registerUser, adminLogin,forgotPassword};
