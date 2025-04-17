import React, { useState } from "react";
import axios from "axios";
import FloatingInput from "../ReUsebleComponents/FloatingInput"; // reuse your input 🌀
import { useNavigate } from "react-router-dom";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/vendor/login", formData);
      const { access_token, vendor_id } = response.data;

      // ✅ Save token and vendor ID to localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("vendor_id", vendor_id);
      console.log("token", access_token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#000000]">Vendor Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <FloatingInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <FloatingInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            onClick={login}
            className="w-full bg-[#1DA1F2] text-white py-2 rounded-full hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
