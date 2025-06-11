import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/otp-verification-and-user-creation', {
        ...userData,
        otp,
      });

      if (response.data.success) {
        alert("Account created successfully!");
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post('/api/v1/generate-otp', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      });

      if (response.data.success) {
        alert("OTP resent successfully to your email");
      } else {
        alert(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Resend OTP failed");
    }
  };

  return (
    <section className="bg-[#f0f9f4] py-16 flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-xl shadow-[10px_0_20px_rgba(0,0,0,0.1),_-10px_0_20px_rgba(0,0,0,0.1),_0_10px_25px_rgba(0,0,0,0.1)] p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Enter OTP</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={handleResendOTP}
              className="bg-green-100 text-green-600 px-4 rounded-md hover:underline"
            >
              Resend OTP
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white py-3 rounded-lg transition-colors font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default OtpPage;
