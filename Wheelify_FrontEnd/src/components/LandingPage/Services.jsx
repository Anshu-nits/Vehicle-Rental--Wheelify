import React from 'react';

// Example user data (replace with API data as needed)
const testimonials = [
  {
    name: 'Sarah Johnson',
    stars: 5,
    text: 'Amazing service! The bike was in perfect condition and the booking process was super easy.',
    image: '',
  },
  {
    name: 'Mike Chen',
    stars: 4,
    text: "I've been renting out my bike through BikeRent for 6 months. Great platform and reliable payments!",
    image: '',
  },
  {
    name: 'Emily Davis',
    stars: 3,
    text: 'Love the variety of bikes available. Perfect for weekend adventures around the city.',
    image: '',
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-[#f0f9f4]">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
        <p className="text-gray-600 mb-8">Join thousands of happy riders and bike owners</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((user, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4
                transition-transform transform hover:scale-105 duration-300
                shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-2xl">👤</span>
                )}
              </div>

              <div className="flex justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={i < user.stars ? '#facc15' : '#e5e7eb'}
                    className="w-5 h-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.617a1 1 0 00.95.69h3.801c.969 0 1.371 1.24.588 1.81l-3.073 2.234a1 1 0 00-.364 1.118l1.175 3.617c.3.921-.755 1.688-1.538 1.118l-3.073-2.234a1 1 0 00-1.175 0l-3.073 2.234c-.783.57-1.838-.197-1.538-1.118l1.175-3.617a1 1 0 00-.364-1.118L2.535 9.044c-.783-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.175-3.617z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 italic text-center">"{user.text}"</p>
              <h4 className="font-bold text-gray-700">{user.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
