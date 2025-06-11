import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PopularBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get('/api/v1/popular-bikes');
        setBikes(response.data.slice(0, 4)); // Display only the first four bikes
      } catch (error) {
        console.error('Error fetching bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center bg-green-50">
        <h2 className="text-3xl font-bold text-green-900 mb-4">Popular Bikes</h2>
        <p className="text-gray-700 mb-10">Loading bikes...</p>
      </section>
    );
  }

  return (
    <section className="py-16 text-center bg-green-50">
      <h2 className="text-3xl font-bold text-green-900 mb-4">Popular Bikes</h2>
      <p className="text-gray-700 mb-10">
        Choose from our most loved bikes for your next adventure
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {bikes.map((bike, index) => (
          <div
            key={index}
            className="bg-white rounded-xl w-64 p-4
              transition-transform transform hover:scale-105 duration-300
              shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
          >
            <div className="bg-gray-200 h-32 rounded-md mb-4 flex justify-center items-center">
              {bike.img ? (
                <img
                  src={bike.img}
                  alt={bike.model}
                  className="h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <h3 className="font-semibold text-green-900 text-lg">
              {bike.company} {bike.model}
            </h3>
            <p className="text-green-600 font-semibold">
              ₹{bike.rentAmount}/day
            </p>
            <p className="text-gray-600">{bike.location}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-yellow-500 font-bold">
                ⭐ {bike.ratings && bike.ratings.length > 0
                  ? (
                      bike.ratings.reduce((sum, r) => sum + r.rating, 0) /
                      bike.ratings.length
                    ).toFixed(1)
                  : 'N/A'}
              </span>
              <button
                onClick={() => navigate('/bike-details', { state: { bike } })}
                className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-600"
              >
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularBikes;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const PopularBikes = () => {
//   const [bikes, setBikes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBikes = async () => {
//       try {
//         const response = await axios.get('/api/v1/popular-bikes');
//         setBikes(response.data.slice(0, 4)); // Display only the first four bikes
//       } catch (error) {
//         console.error('Error fetching bikes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBikes();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-16 text-center bg-green-50">
//         <h2 className="text-3xl font-bold text-green-900 mb-4">Popular Bikes</h2>
//         <p className="text-gray-700 mb-10">Loading bikes...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 text-center bg-green-50">
//       <h2 className="text-3xl font-bold text-green-900 mb-4">Popular Bikes</h2>
//       <p className="text-gray-700 mb-10">
//         Choose from our most loved bikes for your next adventure
//       </p>
//       <div className="flex flex-wrap justify-center gap-6">
//         {bikes.map((bike, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl w-64 p-4
//               transition-transform transform hover:scale-105 duration-300
//               shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
//           >
//             <div className="bg-gray-200 h-32 rounded-md mb-4 flex justify-center items-center">
//               {bike.img ? (
//                 <img
//                   src={bike.img}
//                   alt={bike.model}
//                   className="h-full object-cover rounded-md"
//                 />
//               ) : (
//                 <span className="text-gray-500">No Image</span>
//               )}
//             </div>
//             <h3 className="font-semibold text-green-900 text-lg">
//               {bike.company} {bike.model}
//             </h3>
//             <p className="text-green-600 font-semibold">
//               ₹{bike.rentAmount}/day
//             </p>
//             <p className="text-gray-600">{bike.location}</p>
//             <div className="flex justify-between items-center mt-4">
//               <span className="text-yellow-500 font-bold">
//                 ⭐ {bike.ratings && bike.ratings.length > 0
//                   ? (
//                       bike.ratings.reduce((sum, r) => sum + r.rating, 0) /
//                       bike.ratings.length
//                     ).toFixed(1)
//                   : 'N/A'}
//               </span>
//               <button className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-600">
//                 Rent Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default PopularBikes;

