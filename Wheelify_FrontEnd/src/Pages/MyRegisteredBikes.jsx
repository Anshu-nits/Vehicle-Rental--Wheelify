import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";

const MyRegisteredBikes = () => {
  const [bikes, setBikes] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/my-bikes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBikes(res.data.data);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      }
    };

    fetchBikes();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Registered Bikes</h2>
      {bikes.length === 0 ? (
        <p>You haven't registered any bikes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div key={bike._id} className="border p-4 rounded-lg shadow-md">
              <img src={bike.img} alt={bike.model} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold">{bike.company} - {bike.model}</h3>
              <p className="text-gray-600">Age: {bike.age} year(s)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegisteredBikes;
