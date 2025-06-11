import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="text-center py-16 bg-[#f0f9f4]">
      <h2 className="text-4xl font-bold text-green-900 mb-4">Ride Your Way</h2>
      <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
        Whether you want to rent a bike or share your bike with others, we've got you covered!
      </p>

      <div className="flex justify-center gap-12 flex-wrap">
        {/* Rent a Bike Box */}
        <div className="bg-white rounded-xl p-10 w-96 transition-transform transform hover:scale-105 duration-300 shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
            alt="Rent a Bike"
            className="w-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-green-900 mb-2">Rent a Bike</h3>
          <p className="text-gray-600 mb-6">Find the perfect bike for your adventure</p>
          <Link to="/search-bike">
            <button className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-full">
              Find Bikes
            </button>
          </Link>
        </div>

        {/* Share Your Bike Box */}
        <div className="bg-white rounded-xl p-10 w-96 transition-transform transform hover:scale-105 duration-300 shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3097/3097980.png"
            alt="Share Bike"
            className="w-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-green-900 mb-2">Share Your Bike</h3>
          <p className="text-gray-600 mb-6">Earn money by renting out your bike</p>
          <Link to="/share-bike">
            <button className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-full">
              List Your Bike
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

