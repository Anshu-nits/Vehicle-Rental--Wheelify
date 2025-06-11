import { useState } from 'react';
import RegisterBikeForm from '../components/ShareBike/RegisterBikeForm.jsx';
// import RegisteredBikesList from '../components/ShareBike/RegisteredBikesList.jsx';

const ShareBike = () => {
  const [bikes, setBikes] = useState([]);

  const addBike = (bike) => {
    setBikes((prev) => [...prev, bike]);
  };

  return (
    <section className="min-h-screen py-16 px-6 bg-[#f0f9f4]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-green-900 mb-4">List Your Bike</h2>
        <p className="text-lg text-gray-700 mb-8">
          Register your bikes and start earning by renting them out
        </p>

        <RegisterBikeForm addBike={addBike} />
        {/* <RegisteredBikesList bikes={bikes} />  */}
      </div>
    </section>
  );
};

export default ShareBike;
