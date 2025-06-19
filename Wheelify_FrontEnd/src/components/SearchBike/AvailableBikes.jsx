import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCheck,
  FaSadTear,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext.JSX";

const AvailableBikes = () => {
  const locationState = useLocation().state;
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  if (!locationState?.form) {
    navigate("/", { replace: true });
    return null;
  }

  // Handle case where bikes might be undefined or null
  const { bikes: initialBikes = [], form: initialForm } = locationState;

  const [bikes, setBikes] = useState(initialBikes);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [bookingStates, setBookingStates] = useState({});

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/search-available-bikes",
        formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      setLoading(false);
      if (data.success) {
        setBikes(data.bikes || []); // Ensure bikes is always an array
        setShowForm(false);
        setBookingStates({});
      } else {
        alert(data.message);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error re-searching:", err);

      // Handle 404 case for no bikes found
      if (err.response?.status === 404) {
        setBikes([]);
        setShowForm(false);
        setBookingStates({});
      } else {
        alert("Failed to update search");
      }
    }
  };

  const handleBookNow = async (bike) => {
    if (!token) {
      alert("Please login to book a bike.");
      navigate("/login");
      return;
    }

    setBookingStates((prev) => ({ ...prev, [bike._id]: "loading" }));

    try {
      const bookingPayload = {
        bikeId: bike._id,
        availableDateFrom: formData.desiredDate,
        availableDateTill: formData.desiredDate,
        availableTimeFrom: formData.desiredTimeFrom,
        availableTimeTill: formData.desiredTimeTill,
        period: 1,
      };

      const response = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/add-to-user-cart",
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setBookingStates((prev) => ({ ...prev, [bike._id]: "success" }));
        alert(`${bike.company} ${bike.model} has been added to your cart!`);

        setTimeout(() => {
          setBookingStates((prev) => ({ ...prev, [bike._id]: null }));
        }, 3000);
      } else {
        setBookingStates((prev) => ({ ...prev, [bike._id]: null }));
        alert(response.data.message || "Failed to add bike to cart");
      }
    } catch (error) {
      setBookingStates((prev) => ({ ...prev, [bike._id]: null }));
      console.error("Error adding to cart:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add bike to cart. Please try again.");
      }
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

  const getBookingButtonContent = (bikeId) => {
    const state = bookingStates[bikeId];

    switch (state) {
      case "loading":
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        );
      case "success":
        return (
          <>
            <FaCheck className="mr-2" />
            Added to Cart
          </>
        );
      default:
        return (
          <>
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </>
        );
    }
  };

  const getBookingButtonClass = (bikeId) => {
    const state = bookingStates[bikeId];
    const baseClass =
      "flex-1 px-4 py-2 rounded flex items-center justify-center transition-colors";

    switch (state) {
      case "loading":
        return `${baseClass} bg-gray-400 text-white cursor-not-allowed`;
      case "success":
        return `${baseClass} bg-green-600 text-white`;
      default:
        return `${baseClass} bg-green-500 text-white hover:bg-green-600`;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-900">
          Rent A Bike In {formData.location}
        </h1>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="text-gray-700 text-lg flex flex-wrap items-center gap-2">
          <strong>Your search:</strong>
          <FaCalendarAlt /> {formatDate(formData.desiredDate)}
          <FaClock /> {formatTime(formData.desiredTimeFrom)} -{" "}
          {formatTime(formData.desiredTimeTill)}
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
                <label className="text-sm font-medium mb-1 block">
                  {label}
                </label>
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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Search"}
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
        <h2 className="text-lg font-semibold mb-4">
          Found <strong>{bikes.length}</strong> bikes
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading bikes...</p>
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaSadTear className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No bikes found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any bikes matching your search criteria.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Try adjusting your search parameters or check a different
              location.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center gap-2 mx-auto"
            >
              <FaEdit /> Modify Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((b) => (
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
                  <p className="text-green-700 font-bold mt-2">
                    ₹{b.rentAmount}/day
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      className={getBookingButtonClass(b._id)}
                      onClick={() => handleBookNow(b)}
                      disabled={
                        bookingStates[b._id] === "loading" ||
                        bookingStates[b._id] === "success"
                      }
                    >
                      {getBookingButtonContent(b._id)}
                    </button>
                    <button
                      onClick={() => navigate(`/bike/${b._id}`)}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableBikes;


 