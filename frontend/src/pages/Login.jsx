import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // For forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle forgot password form

  const { setToken, navigate, backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
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
        const response = await axios.post(backendUrl + "/api/user/login", {
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
    try {
      const response = await axios.post(backendUrl + "/api/user/forgot-password", {
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
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
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
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
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