import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext.jsx";

const MyRegisteredBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [showFormForBikeId, setShowFormForBikeId] = useState(null);
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

  useEffect(() => {
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

  const handleStatusToggle = (bikeId, currentStatus) => {
    if (currentStatus === "on rent") {
      alert("Cannot revoke. This bike is currently in service.");
      return;
    }
    if (currentStatus === "provided for rent") {
      handleRevokeService(bikeId);
    } else {
      setShowFormForBikeId(bikeId);
    }
  };

  const handleRevokeService = async (bikeId) => {
    try {
      await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/remove-provided-bike",
        { bikeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBikes((prev) =>
        prev.map((bike) =>
          bike._id === bikeId ? { ...bike, status: "not provided for rent" } : bike
        )
      );
      alert("Bike successfully revoked from rental service.");
    } catch (error) {
      console.error("Failed to revoke service:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (bikeId) => {
    try {
      await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/provide-bike",
        { bikeId, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBikes((prev) =>
        prev.map((bike) =>
          bike._id === bikeId ? { ...bike, status: "provided for rent" } : bike
        )
      );
      alert("Bike provided for rent!");
      setShowFormForBikeId(null);
      setFormData({
        rentAmount: "",
        availableDateFrom: "",
        availableDateTill: "",
        availableTimeFrom: "",
        availableTimeTill: "",
        location: "",
      });
    } catch (error) {
      console.error("Error providing bike:", error);
      alert("Failed to provide bike.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-green-50 py-10 px-12 relative">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
        My Registered Bikes
      </h2>
      {bikes.length === 0 ? (
        <p className="text-center text-gray-600">You haven't registered any bikes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {bikes.map((bike) => (
            <div
              key={bike._id}
              className="bg-white rounded-xl w-full p-6 shadow-md border border-gray-200 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="bg-gray-100 h-48 w-full rounded-md mb-4 flex justify-center items-center overflow-hidden">
                {bike.img ? (
                  <img src={bike.img} alt={bike.model} className="h-full object-contain" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {bike.company} {bike.model}
              </h3>
              <p className="text-sm text-gray-600 mb-1">Age: {bike.age} year(s)</p>
              <p className="text-sm text-gray-600 mb-1">
                Status: <span className="font-medium text-green-700">{bike.status}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Registered On: {bike.createdAt ? new Date(bike.createdAt).toDateString() : "Invalid Date"}
              </p>
              <div className="text-yellow-500 mb-4 text-lg">
                {Array.from({ length: 5 }, (_, i) => <span key={i}>★</span>)}
              </div>
              <div className="flex gap-4 w-full mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusToggle(bike._id, bike.status);
                  }}
                  className="flex-1 bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition"
                >
                  {bike.status === "provided for rent" ? "Revoke Service" : "Lend Service"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <h4 className="text-lg font-semibold mb-4 text-center">Provide Bike Details</h4>
            <div className="grid grid-cols-1 gap-3">
              <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleFormChange} placeholder="Rent Amount" className="p-2 rounded border" />
              <input type="text" name="location" value={formData.location} onChange={handleFormChange} placeholder="Location" className="p-2 rounded border" />
              <input type="date" name="availableDateFrom" value={formData.availableDateFrom} onChange={handleFormChange} className="p-2 rounded border" />
              <input type="date" name="availableDateTill" value={formData.availableDateTill} onChange={handleFormChange} className="p-2 rounded border" />
              <input type="time" name="availableTimeFrom" value={formData.availableTimeFrom} onChange={handleFormChange} className="p-2 rounded border" />
              <input type="time" name="availableTimeTill" value={formData.availableTimeTill} onChange={handleFormChange} className="p-2 rounded border" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormSubmit(showFormForBikeId);
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

export default MyRegisteredBikes;