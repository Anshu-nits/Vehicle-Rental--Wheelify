import React from "react";

const RegisteredBikesList = ({ bikes }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Your Registered Bikes</h3>
      {bikes.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-2xl mb-2">😕</p>
          <p>No bikes currently registered</p>
          <p className="text-sm">Register your first bike to get started</p>
        </div>
      ) : (
        <ul className="text-left">
          {bikes.map((bike) => (
            <li key={bike.id} className="border-b py-2">
              <strong>{bike.name}</strong> - {bike.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegisteredBikesList;
