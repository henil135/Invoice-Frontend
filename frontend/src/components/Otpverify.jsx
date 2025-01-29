import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../public/img/logo.png";
import { TbPasswordMobilePhone } from "react-icons/tb";

const Otpverify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email; // Retrieve email passed via navigate

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const updatedOtp = [...otp];

    if (/^[0-9]{0,1}$/.test(value)) {
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.includes("") || otp.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Incomplete OTP",
        text: "Please enter the complete OTP.",
      });
      return;
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email not found. Please go back and resend the OTP.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/user/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp.join(""), email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: data.message || "OTP verified successfully.",
        }).then(() => {
          navigate("/resetpsw", { state: { email } }); // Navigate to reset password page
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: data.message || "Invalid or expired OTP.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while verifying OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex">
  {/* Left Section (Form) */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-6 relative">
  {/* Logo */}
  <img src={logo} alt="Logo" className="absolute md:top-6 top-2 md:left-6 h-12 sm:h-14" />

  <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mx-1 sm:mt-0 mt-10 sm:mx-6 md:mx-48">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">
      OTP Verification
    </h2>
    <p className="sm:text-xl text-center my-2 text-gray-300 py-2 mx-auto break-words">
      We will send you a confirmation code.
    </p>
    <form onSubmit={handleSubmit}>
      {/* OTP Inputs */}
      <div className="mb-6 flex justify-between space-x-1 sm:space-x-6 lg:space-x-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            id={`otp-${index}`}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            maxLength={1}
            className="w-1/5 sm:w-1/4 md:w-1/6 lg:w-1/8 px-4 py-3 text-sm border border-grey rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="mb-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#438A7A] rounded-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </form>
  </div>
</div>


  {/* Right Section - Image */}
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

export default Otpverify;
