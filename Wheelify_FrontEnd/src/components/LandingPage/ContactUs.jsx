import React, { useState, useContext } from 'react';
import { Phone, Mail } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from "../../AuthContext/AuthContext.jsx";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const { token } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://wheelify-backend.onrender.com/api/v1/contact',
      formData,
      {
          headers: {
            Authorization: `Bearer ${token}`,
           },
          withCredentials: true,
       }); // change base URL if needed
      if (res.data.success) {
        alert('Thank you for reaching out! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Contact form error:', error.message);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-[#f0f9f4] py-16 px-4 sm:px-6 lg:px-20 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h2>
      <p className="text-gray-600 mb-10">
        Have questions? We're here to help with anything related to bike rentals.
      </p>

      <div
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 bg-white rounded-xl p-8 
        shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Left - Form */}
        <div className="text-left">
          <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Your message..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right - Contact Info */}
        <div className="space-y-6 text-left">
          <h3 className="text-xl font-semibold">Get in Touch</h3>

          <div className="bg-[#f8f9fb] p-5 rounded-lg flex items-start gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Phone className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Call Us</h4>
              <p className="text-gray-700">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon–Fri: 9AM–6PM</p>
            </div>
          </div>

          <div className="bg-[#f8f9fb] p-5 rounded-lg flex items-start gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Mail className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Email Us</h4>
              <p className="text-gray-700">support@bikeshare.com</p>
              <p className="text-sm text-gray-500">Response within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
