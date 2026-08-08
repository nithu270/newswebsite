import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, provider, signInWithPopup } from "../config/firebaseconfig";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      alert(`Welcome, ${res.data.userName}`);

      localStorage.setItem("token", res.data.token);

      navigate("/home");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      alert(`Welcome, ${user.displayName}`);

      navigate("/home");
    } catch (error) {
      console.error(error);

      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6 sm:px-6">

      {/* Main Login Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-8 sm:px-10 sm:py-10 md:p-12 lg:p-14 flex flex-col justify-center text-center md:text-left">

          <div className="max-w-md mx-auto md:mx-0">

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
              Welcome Back!
            </h2>

            <p className="text-base sm:text-lg text-blue-50 leading-relaxed">
              Login to access your dashboard and explore more features.
            </p>

            {/* Decorative Lines */}
            <div className="hidden md:flex mt-7 gap-2">
              <div className="w-12 h-1 bg-white rounded-full opacity-90"></div>
              <div className="w-6 h-1 bg-white rounded-full opacity-60"></div>
              <div className="w-3 h-1 bg-white rounded-full opacity-40"></div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">

          <div className="max-w-md mx-auto">

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-1">
              Sign In
            </h2>

            <p className="text-center text-gray-500 text-sm mb-4">
              Welcome back! Please enter your details.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-2.5 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center my-4">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-sm text-gray-400 font-medium">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 active:scale-[0.98] text-gray-700 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-3 transition duration-200 shadow-sm hover:shadow-md"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />

              <span>
                Sign in with Google
              </span>
            </button>

            {/* Register */}
            <p className="text-center text-gray-600 mt-4 text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
              >
                Sign up
              </a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;