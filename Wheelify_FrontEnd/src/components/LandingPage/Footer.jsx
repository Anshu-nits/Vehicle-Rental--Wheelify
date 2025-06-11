import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Bike<span className="text-white">Rent</span></h2>
          <p className="text-sm">
            Your trusted partner for bike rentals and sharing. Ride responsibly, ride with us.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Bikes</a></li>
            <li><a href="#" className="hover:underline">Reviews</a></li>
            <li><a href="#" className="hover:underline">How It Works</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Safety Guidelines</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MdEmail /> support@bikerent.com</li>
            <li className="flex items-center gap-2"><FaPhoneAlt /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> 123 Bike Street, City, State</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-green-700 mt-10 pt-4 text-center text-sm">
        <p>© 2024 BikeRent. All rights reserved. Made with <span className="text-red-400">❤️</span> for bike lovers.</p>
      </div>
    </footer>
  );
};

export default Footer;
