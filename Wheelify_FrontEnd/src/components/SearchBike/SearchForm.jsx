import React, { useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const [formData, setFormData] = useState({
    desiredDate: "",
    desiredTimeFrom: "",
    desiredTimeTill: "",
    location: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/v1/search-available-bikes", formData);
      if (data.success) {
        navigate("/available-bike", { state: { bikes: data.bikes, form: formData } });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="text-center py-16 bg-[#f0f9f4]">
      <h2 className="text-4xl font-bold text-green-900 mb-4">Find Your Perfect Bike</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
      >
        <div>
          <label className="flex items-center gap-2 font-semibold text-green-900 mb-2">
            <FaCalendarAlt /> Desired Date
          </label>
          <input
            type="date"
            name="desiredDate"
            value={formData.desiredDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-green-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-green-900 mb-2">
            <FaMapMarkerAlt /> Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-green-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-green-900 mb-2">
            <FaClock /> Desired Time From
          </label>
          <input
            type="time"
            name="desiredTimeFrom"
            value={formData.desiredTimeFrom}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-green-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-green-900 mb-2">
            <FaClock /> Desired Time Till
          </label>
          <input
            type="time"
            name="desiredTimeTill"
            value={formData.desiredTimeTill}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-green-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-green-400 hover:bg-green-500 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
        >
          <FaSearch /> Search Bikes
        </button>
      </form>
    </section>
  );
};

export default SearchForm;

