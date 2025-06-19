import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import axios from "axios";

const BikeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchBikeDetail = async () => {
            try {
                const res = await axios.get(`https://vehicle-rental-wheelify-backend.onrender.com/api/v1/bike/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBike(res.data.data);
            } catch (err) {
                console.error("Error fetching bike detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBikeDetail();
    }, [id, token]);

    // Calculate average rating and review count
    const calculateRatingData = () => {
        if (!bike?.ratings || bike.ratings.length === 0) {
            return { avgRating: 0, reviewCount: 0 };
        }
        
        const totalRating = bike.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const avgRating = (totalRating / bike.ratings.length).toFixed(1);
        
        return { 
            avgRating: parseFloat(avgRating), 
            reviewCount: bike.ratings.length 
        };
    };

    // Sort reviews by date (newest first)
    const getSortedReviews = () => {
        if (!bike?.ratings || bike.ratings.length === 0) return [];
        
        return [...bike.ratings].sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || 0);
            const dateB = new Date(b.timestamp || b.createdAt || 0);
            return dateB - dateA; // Newest first
        });
    };

    // Generate star display based on rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <>
                {"★".repeat(fullStars)}
                {hasHalfStar && "☆"}
                {"☆".repeat(emptyStars)}
            </>
        );
    };

    // Get user initials for avatar
    const getUserInitials = (name) => {
        if (!name) return "U";
        const names = name.split(" ");
        if (names.length >= 2) {
            return names[0][0].toUpperCase() + names[1][0].toUpperCase();
        }
        return name[0].toUpperCase();
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!bike) return <div className="text-center py-10 text-red-500">Bike not found.</div>;

    const { avgRating, reviewCount } = calculateRatingData();
    const sortedReviews = getSortedReviews();
    const reviewsToShow = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <button
                onClick={() => navigate("/share-bike")}
                className="text-green-600 hover:underline mb-6 flex items-center"
            >
                ← Back to Bikes
            </button>

            <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-xl shadow-md">
                {/* Image */}
                <div className="flex-1">
                    <img
                        src={bike.img}
                        alt={bike.model}
                        className="w-full h-80 object-cover rounded-xl bg-green-100"
                    />
                </div>

                {/* Bike Info */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold">
                        {bike.company} {bike.model}
                    </h2>

                    <div className="flex items-center gap-2 text-yellow-500">
                        <span className="text-xl">
                            {avgRating > 0 ? renderStars(avgRating) : "☆☆☆☆☆"}
                        </span>
                        <span className="text-gray-600 text-sm">
                            {avgRating > 0 ? `${avgRating} (${reviewCount} reviews)` : "(No reviews yet)"}
                        </span>
                    </div>

                    <div className="text-gray-700 text-sm flex items-center gap-1">
                        📍 {bike.location}
                    </div>

                    <div className="mt-4">
                        <div className="text-3xl font-bold text-green-600">
                            ₹{bike.rentAmount} <span className="text-lg font-medium text-gray-600">/day</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            <span className="line-through mr-2">₹{Math.round(bike.rentAmount * 1.2)}</span>
                            <span className="text-green-600 font-medium">20% off for NIT Silchar students!</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Bike Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
                            <div><span className="font-semibold">Company:</span> {bike.company}</div>
                            <div><span className="font-semibold">Model:</span> {bike.model}</div>
                            <div><span className="font-semibold">Age:</span> {bike.age} year(s)</div>
                            <div><span className="font-semibold">Status:</span> {bike.status}</div>
                        </div>
                    </div>

                    <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300">
                        Rent Now
                    </button>
                </div>
            </div>

            {bike.Owner && (
                <div className="mt-10 bg-green-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-5 text-green-900">Owner Details</h3>

                    <div className="flex items-start gap-5">
                        {/* Initials Circle */}
                        <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
                            {bike.Owner.name?.[0]?.toUpperCase() || "?"}
                        </div>

                        {/* Owner Info */}
                        <div className="text-sm text-gray-800 space-y-2">
                            <div>
                                <span className="font-semibold">Name:</span> {bike.Owner.name}
                            </div>
                            <div>
                                <span className="font-semibold">Email:</span> {bike.Owner.email}
                            </div>
                            <div>
                                <span className="font-semibold">Contact Me:</span> {bike.Owner.contactNumber || "Not Provided"}
                            </div>
                        </div>
                    </div>

                    {/* Owner Message */}
                    <div className="mt-6 text-sm text-blue-900 bg-blue-100 p-4 rounded-md border border-blue-300">
                        "Hi! I'm {bike.Owner.name}, and I love sharing my bikes with fellow cycling enthusiasts.
                        Feel free to message me if you have any questions!"
                    </div>

                    {/* Verification Badge */}
                    <div className="mt-4 text-green-700 text-sm font-medium">
                        ✅ Verification Status: Verified Owner
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {bike.ratings && bike.ratings.length > 0 && (
                <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Reviews ({reviewCount})</h3>
                        {reviewCount > 3 && (
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="text-green-600 hover:underline text-sm font-medium transition-colors duration-200"
                            >
                                {showAllReviews ? 'Show less' : `View all ${reviewCount} reviews`}
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-6">
                        {reviewsToShow.map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                {/* User Info and Rating */}
                                <div className="flex items-start gap-3 mb-3">
                                    {/* User Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {review.username ? getUserInitials(review.username) : 
                                         review.user?.name ? getUserInitials(review.user.name) : "U"}
                                    </div>
                                    
                                    {/* User Name and Rating */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {review.username || review.user?.name || "Anonymous User"}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-500 text-sm">
                                                    {renderStars(review.rating)}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Review Text */}
                                        {(review.review || review.comment || review.text) && (
                                            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                                                "{review.review || review.comment || review.text}"
                                            </p>
                                        )}
                                        
                                        {/* Timestamp */}
                                        <div className="text-xs text-gray-500">
                                            {review.timestamp || review.createdAt ? 
                                                new Date(review.timestamp || review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'Recent'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Platform Rules & Guidelines */}
            <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Rules & Guidelines</h3>

                {/* Rental Guidelines */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <span>🛵</span> Rental Guidelines
                    </div>
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                        <li>Valid college ID required at pickup</li>
                        <li>Only NIT Silchar students can rent bikes</li>
                        <li>Helmet must be worn at all times (provided free)</li>
                        <li>Rental slots available only between 6 AM – 10 PM</li>
                    </ul>
                </div>

                {/* Timing & Cancellation */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <span>⏰</span> Timing & Cancellation
                    </div>
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                        <li>Cancel up to 1 hour before pickup for free</li>
                        <li>Late returns: ₹5 per hour fine</li>
                        <li>Grace period of 15 mins on return</li>
                    </ul>
                </div>

                {/* Responsibilities */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <span>🧑‍🔧</span> Responsibilities
                    </div>
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                        <li>Return the bike in good condition</li>
                        <li>Report damage or issues immediately</li>
                        <li>Follow NIT campus traffic guidelines</li>
                        <li>Strictly no stunts or racing within campus</li>
                    </ul>
                </div>

                {/* Insurance & Coverage */}
                <div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <span>🛡️</span> Safety & Coverage
                    </div>
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                        <li>Basic coverage included in rental</li>
                        <li>You're liable only for major damage or theft</li>
                        <li>Emergency support via Student Helpline</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BikeDetail;