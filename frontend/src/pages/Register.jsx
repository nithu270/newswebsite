import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setSuccess("Registration successful! Redirecting to login...");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4 py-6">

      <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-3xl overflow-hidden">

        {/* LEFT PANEL - Desktop Only */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-tr from-blue-500 to-purple-600 text-white px-7 py-8 flex-col justify-center">

          <h2 className="text-3xl font-bold mb-3">
            Join Us Today!
          </h2>

          <p className="text-sm leading-relaxed text-blue-50">
            Create your account and start your journey with us.
          </p>

          <div className="mt-6 text-sm space-y-2">
            <p>✓ Access your personalized dashboard</p>
            <p>✓ Explore the latest news</p>
            <p>✓ Enjoy all our features</p>
          </div>

        </div>

        {/* REGISTER FORM */}
        <div className="w-full md:w-3/5 px-6 py-7 sm:px-8 sm:py-8">

          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-5">
            Create Account
          </h2>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center text-sm mb-3">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="text-green-500 text-center text-sm mb-3">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition duration-300 mt-2"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-gray-600 text-sm mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;