import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in both fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/user/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Check the role and navigate accordingly
        if (data.user.role === "user") {
          navigate("/user");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Role",
            text: "Your role is not recognized.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Login failed. Please try again.",
        });
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "An Error Occurred",
        text: "Please try again later.",
      });
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 flex flex-col justify-center h-full relative">
          {/* Logo */}
          <img
            src="/img/logo.png"
            alt="Logo"
            className="absolute md:top-6 top-2 left-2 md:left-6 h-10 sm:h-12 md:h-14"
          />

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mt-20 mx-4 sm:mx-8 md:mx-48 md:mt-0 mt-18">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Sign in to continue to Invoice.
            </p>
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#438A7A]"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex md:flex-row flex-col items-center justify-between mb-6">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="mr-2 rounded text-[#438A7A] focus:ring-[#438A7A]"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgetpassword"
                  className="text-sm text-[#438A7A] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-[#438A7A] rounded-lg hover:bg-[#35695E] focus:outline-none"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Sign Up */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#438A7A] hover:underline">
                Signup now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="bg-[#438A7A] hidden md:flex md:w-1/2 p-10 relative h-full">
          {/* Image Container */}
          <div className="absolute inset-0 z-10">
            <div className="bg-[#356759] h-full opacity-40 relative">
              <img
                src="/img/img.jpg"
                alt="Login Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-20 text-center text-white p-6">
            <blockquote className="text-lg italic">
              "I feel confident imposing on myself"
            </blockquote>
            <p className="text-sm mt-4">
              Vestibulum auctor orci sit amet risus iaculis consequat. Sed
              tempus in elementum augue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
