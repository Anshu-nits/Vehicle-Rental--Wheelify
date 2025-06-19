import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext.jsx";

const ManageBike = () => {
  const [bikes, setBikes] = useState([]);
  const [showFormForBikeId, setShowFormForBikeId] = useState(null);
  const [showUnregisterConfirmId, setShowUnregisterConfirmId] = useState(null); // 👈 new
  const [formData, setFormData] = useState({
    rentAmount: "",
    availableDateFrom: "",
    availableDateTill: "",
    availableTimeFrom: "",
    availableTimeTill: "",
    location: "",
  });

  const formRef = useRef();
  const { token } = useContext(AuthContext);

  const fetchBikes = async () => {
    try {
      const res = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/my-bikes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBikes(res.data.data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFormForBikeId && formRef.current && !formRef.current.contains(e.target)) {
        setShowFormForBikeId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFormForBikeId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnregister = async (bikeId) => {
    try {
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/unregister-bike",
        { bikeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setShowUnregisterConfirmId(null);
      fetchBikes(); // Refresh list
    } catch (error) {
      console.error("Error unregistering bike:", error);
      alert(
        error?.response?.data?.message || "Something went wrong while unregistering."
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-green-50 py-10 px-12 relative">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        My Registered Bikes
      </h2>
      {bikes.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven't registered any bikes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {bikes.map((bike) => (
            <div
              key={bike._id}
              className="bg-white rounded-xl w-full p-6 shadow-md border border-gray-200 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="bg-gray-100 h-48 w-full rounded-md mb-4 flex justify-center items-center overflow-hidden">
                {bike.img ? (
                  <img
                    src={bike.img}
                    alt={bike.model}
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {bike.company} {bike.model}
              </h3>
              <p className="text-sm text-gray-600 mb-1">Age: {bike.age} year(s)</p>
              <p className="text-sm text-gray-600 mb-1">
                Status:{" "}
                <span className="font-medium text-green-700">{bike.status}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Registered On:{" "}
                {bike.createdAt
                  ? new Date(bike.createdAt).toDateString()
                  : "Invalid Date"}
              </p>
              <div className="text-yellow-500 mb-4 text-lg">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <div className="flex gap-4 w-full mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUnregisterConfirmId(bike._id); // 👈 open confirmation
                  }}
                  className="flex-1 bg-red-500 text-white rounded-md py-2 hover:bg-red-600 transition"
                >
                  Unregister
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showUnregisterConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Are you sure you want to unregister this bike?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowUnregisterConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleUnregister(showUnregisterConfirmId)}
              >
                Yes, Unregister
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rent Info Modal */}
      {showFormForBikeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={formRef}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
          >
            <button
              onClick={() => setShowFormForBikeId(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
            >
              ×
            </button>
            <h4 className="text-lg font-semibold mb-4 text-center">
              Provide Bike Details
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleFormChange}
                placeholder="Rent Amount"
                className="p-2 rounded border"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Location"
                className="p-2 rounded border"
              />
              <input
                type="date"
                name="availableDateFrom"
                value={formData.availableDateFrom}
                onChange={handleFormChange}
                className="p-2 rounded border"
              />
              <input
                type="date"
                name="availableDateTill"
                value={formData.availableDateTill}
                onChange={handleFormChange}
                className="p-2 rounded border"
              />
              <input
                type="time"
                name="availableTimeFrom"
                value={formData.availableTimeFrom}
                onChange={handleFormChange}
                className="p-2 rounded border"
              />
              <input
                type="time"
                name="availableTimeTill"
                value={formData.availableTimeTill}
                onChange={handleFormChange}
                className="p-2 rounded border"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormSubmit(showFormForBikeId); // implement if needed
              }}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBike;