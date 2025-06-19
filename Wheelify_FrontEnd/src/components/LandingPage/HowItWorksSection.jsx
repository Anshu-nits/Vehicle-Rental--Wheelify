import React, { useState } from "react";
import {
  FaSearch,
  FaClipboardList,
  FaBiking,
  FaStar,
  FaBicycle,
  FaFileAlt,
} from "react-icons/fa";
import { MdCalendarToday, MdOutlineCheckCircle } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { BsPeopleFill } from "react-icons/bs";
import { Link } from "react-router-dom"; // ✅ Keep this import

const renterSteps = [
  {
    icon: <FaSearch className="text-4xl text-green-600" />,
    step: "1",
    title: "Browse & Choose",
    desc: "Browse available bikes in your area and choose the perfect one for your needs.",
  },
  {
    icon: <MdCalendarToday className="text-4xl text-purple-600" />,
    step: "2",
    title: "Book Instantly",
    desc: "Book your bike instantly through our app with secure payment options.",
  },
  {
    icon: <FaBiking className="text-4xl text-pink-600" />,
    step: "3",
    title: "Pick Up & Ride",
    desc: "Pick up your bike from the designated location and start your adventure.",
  },
  {
    icon: <FaStar className="text-4xl text-yellow-500" />,
    step: "4",
    title: "Return & Rate",
    desc: "Return the bike safely and rate your experience to help other users.",
  },
];

const ownerSteps = [
  {
    icon: <FaFileAlt className="text-4xl text-blue-600" />,
    step: "1",
    title: "Register Bike",
    desc: "Register your bike with photos and details to start earning from rentals.",
  },
  {
    icon: <FaBicycle className="text-4xl text-green-600" />,
    step: "2",
    title: "Provide Bike for Rent",
    desc: "Set availability, pricing, and pickup location to list your bike.",
  },
  {
    icon: <MdOutlineCheckCircle className="text-4xl text-purple-600" />,
    step: "3",
    title: "Approve Pickup",
    desc: "Review requests and approve pickup times that work for you.",
  },
  {
    icon: <GiReceiveMoney className="text-4xl text-orange-600" />,
    step: "4",
    title: "Receive Payment",
    desc: "Get paid automatically and receive ratings from renters.",
  },
];

const HowItWorks = () => {
  const [activeUser, setActiveUser] = useState("renter");

  const steps = activeUser === "renter" ? renterSteps : ownerSteps;

  return (
    <section className="bg-[#f0f9f4] py-16 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>

        {/* Toggle Buttons */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white rounded-full shadow-md flex overflow-hidden border border-gray-200">
            <button
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
                activeUser === "renter"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveUser("renter")}
            >
              <BsPeopleFill /> For Renters
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
                activeUser === "owner"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveUser("owner")}
            >
              <FaBicycle /> For Bike Owners
            </button>
          </div>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map(({ icon, step, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 flex flex-col items-center transition-transform transform hover:scale-105 duration-300
              shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                {icon}
              </div>
              <div
                className={`w-10 h-10 flex items-center justify-center ${
                  activeUser === "renter" ? "bg-green-500" : "bg-blue-500"
                } text-white rounded-full text-lg font-bold mb-2`}
              >
                {step}
              </div>
              <h4 className="text-xl font-semibold text-green-900">{title}</h4>
              <p className="text-gray-700 mt-2">{desc}</p>
            </div>
          ))}
        </div>

        {/* Get Started Button with Conditional Link and Color */}
        <Link
          to={activeUser === "renter" ? "/search-bike" : "/share-bike"}
          className={`mt-12 inline-block ${
            activeUser === "renter" ? "bg-green-500" : "bg-blue-500"
          } text-white font-semibold py-3 px-6 rounded-lg hover:${
            activeUser === "renter" ? "bg-green-600" : "bg-blue-600"
          } transition-colors`}
        >
          Get Started Today
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
