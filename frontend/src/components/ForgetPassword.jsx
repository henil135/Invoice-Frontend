import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email address.",
      });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8001/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message || "OTP sent successfully.",
        }).then(() => {
          navigate("/otpverify", { state: { email } });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to send OTP.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section - Left side */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center relative ">
        {/* Logo */}
        <img src="/img/logo.png" alt="Logo" className="absolute md:top-6 top-2 md:left-6 h-12 sm:h-14" />
        
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mx-1 sm:mt-0 mt-10 sm:mx-6 md:mx-40">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm border border-grey rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
  
            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-bgprimary rounded-lg hover:bg-black focus:ring-2 focus:ring-bgprimary focus:outline-none"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
  
          {/* Footer */}
          <div className="text-sm text-center text-gray-600">
            Remembered your password?{" "}
            <a href="/" className="text-indigo-600 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
  
      {/* Image Section - Right side */}
      <div className="bg-[#438A7A] hidden md:flex md:w-1/2 p-10 relative">
    {/* Image Container with full coverage */}
    <div className="absolute inset-0 z-10">
      <div className="bg-[#356759]  h-full opacity-40 relative">
        <img
          src="/img/img.jpg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    {/* Content (text, quote, etc.) */}
    <div className="absolute bottom-0 left-0 right-0 z-20 text-center text-white p-6">
      <blockquote className="text-lg italic">
        "I feel confident imposing on myself"
      </blockquote>
      <p className="text-sm mt-4">
        Vestibulum auctor orci sit amet risus iaculis consequat. Sed tempus in elementum augue.
      </p>
    </div>
  </div>
    </div>

  

  );
};

export default ForgotPassword;

