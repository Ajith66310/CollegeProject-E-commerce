import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // For forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle forgot password form
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility

  const { setToken, navigate } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${import.meta.env.backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Sign-up successful!");
          navigate("/"); // Redirect to home page
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${import.meta.env.backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
          navigate("/"); // Redirect to home page
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onForgotPasswordHandler = async (event) => {
    event.preventDefault();

    // Regular expression for strong password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be at least 8 characters long and include at least one letter, one number, and one symbol");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.backendUrl}/api/user/forgot-password`, {
        email,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password updated successfully");
        setShowForgotPassword(false); // Close the forgot password form
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      {!showForgotPassword ? (
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl ">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
          {currentState === "Login" ? (
            ""
          ) : (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              className=" w-full px-3 py-2 border border-gray-800"
              required
            />
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <div className="relative w-full">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p
              className="cursor-pointer"
              onClick={() => setShowForgotPassword(true)} // Show forgot password form
            >
              Forgot your password
            </p>
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer"
              >
                Create account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer"
              >
                Login Here
              </p>
            )}
          </div>
          <button className="bg-black text-white font-light px-8 py-2 mt-4">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={onForgotPasswordHandler}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl ">Forgot Password</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <div className="relative w-full">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-3 py-2 border border-gray-800 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="bg-black text-white font-light px-8 py-2 mt-4">
            Reset Password
          </button>
          <p
            className="cursor-pointer text-sm mt-2"
            onClick={() => setShowForgotPassword(false)} // Go back to login form
          >
            Back to Login
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;