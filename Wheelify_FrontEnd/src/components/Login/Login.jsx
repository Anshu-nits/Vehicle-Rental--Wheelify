import React, { useState, useContext } from 'react';
import { FaBiking, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext/AuthContext.jsx';


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/login', { email, password }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setToken(response.data.token); // Save to context
        alert('Login successful!');
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="bg-[#f0f9f4] py-16 flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-xl shadow-[...styles...] p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 flex items-center justify-center bg-green-100 text-green-600 rounded-full mx-auto mb-4">
          <FaBiking className="text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-6">Welcome Back!</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border ..."
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border ..."
            />
            <div
              className="absolute inset-y-0 right-3 ..."
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg ..."
          >
            Sign In
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-green-700 hover:underline">Forgot Password?</Link>
          <Link to="/signup" className="text-green-700 hover:underline">Sign Up</Link>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
