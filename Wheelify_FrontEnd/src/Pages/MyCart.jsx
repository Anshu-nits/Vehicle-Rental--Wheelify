import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTrash, FaCreditCard, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-cart-details", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) {
        setCartItems(res.data.cartItems || []);
      } else {
        console.error("Failed to fetch cart:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (bookingMongoId) => {
    try {
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/remove-from-user-cart",
        { bookingId: bookingMongoId }, // Send MongoDB _id for removal
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== bookingMongoId));
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/clear-user-cart",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const handlePayment = async (booking) => {
    try {
      const res = await axios.post(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/add-to-history",
        { bookingId: booking.bookingId }, // Use the custom bookingId string field
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        alert("Payment successful!");
        fetchCart(); // Refresh cart after successful payment
      } else {
        alert("Payment failed.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      if (err.response?.data?.message) {
        alert(`Payment failed: ${err.response.data.message}`);
      } else {
        alert("Payment failed.");
      }
    }
  };

  const handleCheckoutAll = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const results = await Promise.allSettled(
        cartItems.map((item) =>
          axios.post(
            "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/add-to-history",
            { bookingId: item.bookingId }, // Use the custom bookingId string field
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          )
        )
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (failed === 0) {
        alert("All bookings paid successfully!");
        fetchCart(); // Refresh cart after successful payments
      } else if (successful > 0) {
        alert(`${successful} bookings paid successfully, ${failed} failed.`);
        fetchCart(); // Refresh cart to show updated state
      } else {
        alert("All payments failed. Please try again.");
        // Log the errors for debugging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Payment ${index + 1} failed:`, result.reason?.response?.data?.message || result.reason);
          }
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred during checkout.");
    }
  };

  const total = cartItems.reduce((sum, booking) => 
    sum + (booking.rentAmount || 0) * (booking.period || 1), 0
  );
  const serviceFee = 5;
  const tax = +(total * 0.085).toFixed(2);
  const grandTotal = (total + serviceFee + tax).toFixed(2);

  if (loading) return <div className="p-6">Loading your cart...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Link to="/" className="text-green-600 flex items-center mb-4 font-medium">
        <span className="text-xl mr-2">←</span> Back to Home
      </Link>

      <h2 className="text-3xl font-bold mb-4">My Cart</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">
              Cart Items ({cartItems.length})
            </h3>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <FaTimes className="mr-1" /> Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-6">Your cart is empty.</p>
          ) : (
            cartItems.map((booking) => {
              const { _id, bookingId, period = 1, rentAmount = 0, bike, location, paymentStatus } = booking;
              // bike is now populated from the booking
              const bikeInfo = bike || {};
              
              // Check if this booking is already paid
              const isPaid = paymentStatus === 'paid';
              
              return (
                <div key={_id} className="mb-6 border-b pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-36 h-28 bg-gray-200 flex items-center justify-center rounded-md">
                      {bikeInfo?.img ? (
                        <img
                          src={bikeInfo.img}
                          alt={bikeInfo.model}
                          className="h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold">
                        {bikeInfo?.company} {bikeInfo?.model}
                      </h4>
                      <p className="text-gray-600">{location}</p>
                      <p className="mt-2">
                        Rental Period: <span className="font-bold">{period} days</span>
                      </p>
                      <p className="text-green-600 font-bold text-lg mt-1">
                        ₹{rentAmount * period}
                        <span className="text-gray-500 text-sm ml-2">
                          (₹{rentAmount}/day × {period} days)
                        </span>
                      </p>
                      
                      {isPaid && (
                        <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Paid
                        </div>
                      )}

                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleRemove(_id)}
                          className="flex items-center text-red-600 border border-red-400 px-4 py-1 rounded-md hover:bg-red-50"
                          disabled={isPaid}
                        >
                          <FaTrash className="mr-2" /> Remove
                        </button>
                        <button
                          className={`flex items-center px-4 py-1 rounded-md ${
                            isPaid 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          onClick={() => handlePayment(booking)}
                          disabled={isPaid}
                        >
                          <FaCreditCard className="mr-2" /> 
                          {isPaid ? 'Already Paid' : 'Pay Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          {cartItems.map((booking) => {
            const bikeInfo = booking.bike || {};
            const isPaid = booking.paymentStatus === 'paid';
            return (
              <div key={booking._id} className={`flex justify-between mb-2 ${isPaid ? 'text-gray-500' : ''}`}>
                <span>
                  {bikeInfo?.company} {bikeInfo?.model} ({booking.period || 1} days)
                  {isPaid && ' ✓'}
                </span>
                <span>₹{(booking.rentAmount || 0) * (booking.period || 1)}</span>
              </div>
            );
          })}
          <hr className="my-3" />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>₹{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-green-600 text-lg">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            className={`flex items-center justify-center mt-6 w-full py-2 rounded-md ${
              cartItems.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            onClick={handleCheckoutAll}
            disabled={cartItems.length === 0}
          >
            <FaCreditCard className="mr-2" /> Checkout All Items
          </button>

          <div className="bg-green-50 p-4 rounded-md mt-5 text-sm text-green-800 leading-6">
            <p>• Free cancellation up to 2 hours before pickup</p>
            <p>• Valid ID required for bike pickup</p>
            <p>• Helmet included with every rental</p>
            <p>• Late return fees may apply</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;