import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AvailableBikes = () => {
  const locationState = useLocation().state;
  const navigate = useNavigate();

  if (!locationState) {
    navigate("/", { replace: true });
    return null;
  }

  const { bikes: initialBikes, form: initialForm } = locationState;

  const [bikes, setBikes] = useState(initialBikes);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/bikes/search", formData);
      setLoading(false);
      if (data.success) {
        setBikes(data.bikes);
        setShowForm(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error re-searching:", err);
      alert("Failed to update search");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    const hh = h % 12 || 12;
    return `${hh}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-2">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Rent A Bike In {formData.location}
      </h1>

      <div className="bg-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="text-gray-700 text-lg flex flex-wrap items-center gap-2">
          <strong>Your search:</strong>
          <FaCalendarAlt /> {formatDate(formData.desiredDate)}
          <FaClock /> {formatTime(formData.desiredTimeFrom)} - {formatTime(formData.desiredTimeTill)}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-orange-500 text-white px-4 py-2 mt-2 md:mt-0 rounded hover:bg-orange-600 flex items-center gap-2"
        >
          <FaEdit /> Modify
        </button>
      </div>

      {showForm && (
        <div className="mb-10 border border-gray-200 shadow-md rounded-xl p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Modify Your Search</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              ["desiredDate", "Date", "date"],
              ["desiredTimeFrom", "Start Time", "time"],
              ["desiredTimeTill", "End Time", "time"],
              ["location", "Location", "text"],
            ].map(([name, label, type]) => (
              <div key={name}>
                <label className="text-sm font-medium mb-1 block">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Search
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Found <strong>{bikes.length}</strong> bikes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">Loading bikes...</p>
          ) : bikes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No bikes found.</p>
          ) : (
            bikes.map((b) => (
              <div
                key={b._id}
                className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden transition hover:shadow-lg"
              >
                <img
                  src={b.img}
                  alt={`${b.company} ${b.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {b.company} {b.model}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt /> {b.location}
                  </p>
                  <p className="text-green-700 font-bold mt-2">₹{b.rentAmount}/day</p>
                  <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableBikes;

