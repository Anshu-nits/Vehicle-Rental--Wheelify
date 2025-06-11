import { FaSearch, FaClipboardList, FaBiking, FaStar } from "react-icons/fa";

const steps = [
  {
    icon: <FaSearch className="text-4xl text-indigo-600" />,
    step: "1",
    title: "Browse & Choose",
    desc: "Browse available bikes in your area and choose the perfect one for your needs.",
  },
  {
    icon: <FaClipboardList className="text-4xl text-purple-600" />,
    step: "2",
    title: "Book Instantly",
    desc: "Book your bike instantly through our app with secure payment options.",
  },
  {
    icon: <FaBiking className="text-4xl text-pink-600" />,
    step: "3",
    title: "Pick Up & Ride",
    desc: "Pick up your bike from the designated location and start your adventure.",
  },
  {
    icon: <FaStar className="text-4xl text-yellow-500" />,
    step: "4",
    title: "Return & Rate",
    desc: "Return the bike safely and rate your experience to help other users.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#f0f9f4] py-16 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map(({ icon, step, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 flex flex-col items-center transition-transform transform hover:scale-105 duration-300
                shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                {icon}
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-lg font-bold mb-2">
                {step}
              </div>
              <h4 className="text-xl font-semibold text-green-900">{title}</h4>
              <p className="text-gray-700 mt-2">{desc}</p>
            </div>
          ))}
        </div>
        <button className="mt-12 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
          Get Started Today
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
