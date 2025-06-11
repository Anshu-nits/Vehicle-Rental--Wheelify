import { useState, useEffect } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const BikeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackBike = {
    name: 'Honda Activa 6G',
    pricePerDay: 380,
    address: 'Karol Bagh, New Delhi',
    description: 'India\'s most trusted scooter. Great for shopping trips and daily commuting.',
    rating: 4.7,
    reviews: 95,
    location: 'New Delhi',
    rentAmount: 380,
    img: null,
    ratings: [],
    owner: {
      name: 'Priya Sharma',
      rentals: 189,
      responseTime: '30 minutes',
    },
  };

  const bikeData = location.state?.bike || fallbackBike;

  useEffect(() => {
    // Redirect to home if no state was passed
    if (!location.state?.bike) {
      navigate('/');
    }
  }, [location, navigate]);

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');

  return (
    <div className="flex flex-col md:flex-row px-4 py-8 bg-[#f9fdfb] gap-6">
      {/* Left: Bike Info */}
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-2 cursor-pointer" onClick={() => navigate(-1)}>
          &larr; Back to Results
        </p>

        {/* Image Placeholder */}
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-xl mb-6">
          {bikeData.img ? (
            <img src={bikeData.img} alt={bikeData.name} className="h-full object-cover rounded-xl" />
          ) : (
            <span className="text-gray-500">[ Image Slider Placeholder ]</span>
          )}
        </div>

        <h2 className="text-3xl font-bold">{bikeData.name}</h2>
        <p className="text-gray-600 mt-1">{bikeData.address}</p>
        <p className="text-yellow-600 font-semibold mt-2">
          ⭐ {bikeData.rating} ({bikeData.reviews} reviews)
        </p>
        <p className="text-gray-700 mt-4">{bikeData.description}</p>

        {/* Rental Rules */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Rental Rules</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Valid driving license required</li>
            <li>Security deposit: ₹1500</li>
            <li>Fuel to be returned as received</li>
            <li>Maximum 2 riders allowed</li>
            <li>Return clean and undamaged</li>
          </ul>
        </div>

        {/* Owner Info */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow border w-full">
          <h3 className="text-lg font-bold mb-2">Bike Owner</h3>
          <p className="text-gray-800 font-semibold">{bikeData.owner.name}</p>
          <p className="text-gray-500">Metro Scooters</p>
          <p className="text-yellow-600 mt-1">
            ⭐ 4.8 &middot; {bikeData.owner.rentals} rentals
          </p>
          <p className="text-gray-500">Responds within {bikeData.owner.responseTime}</p>
          <div className="mt-3 flex gap-2">
            <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg">Call</button>
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Message</button>
          </div>
        </div>
      </div>

      {/* Right: Booking Card */}
      <div className="w-full md:w-96 sticky top-4 self-start bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-green-500 flex items-center">
          <FaRupeeSign className="mr-1" />
          {bikeData.pricePerDay}
          <span className="text-base text-gray-500 ml-2">per day</span>
        </h2>

        {/* Date Pickers */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border rounded p-2 mb-3" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full border rounded p-2" />
        </div>

        {/* Time Pickers */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full border rounded p-2 mb-3" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
          <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full border rounded p-2" />
        </div>

        <button className="w-full mt-6 bg-green-400 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition">
          Book Now
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Free cancellation up to 2 hours before pickup
          <br />
          You won't be charged yet
        </p>
      </div>
    </div>
  );
};

export default BikeDetails;
