import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaHistory,
  FaHeart,
  FaCreditCard,
  FaEdit,
  FaSignOutAlt,
  FaBook,
  FaUserCircle,
} from 'react-icons/fa';
import { AuthContext } from '../../AuthContext/AuthContext.jsx';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout(); // Clears token and updates context
    navigate('/'); // Redirects to login page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Circular button */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 bg-white text-green-700 rounded-full flex items-center justify-center hover:bg-green-100 transition duration-300"
      >
        <FaUserCircle className="text-2xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl py-2 z-50">
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaUser /> My Profile
          </Link>
          <Link to="/registered-bikes" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaHistory /> My Registered Bikes
          </Link>
          <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaBook /> My Bookings
          </Link>
          <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaHeart /> Wishlist
          </Link>
          <Link to="/transactions" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaCreditCard /> Transaction History
          </Link>
          <Link to="/edit-profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
            <FaEdit /> Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

// import { useState, useRef, useEffect, useContext } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   FaUser,
//   FaHistory,
//   FaHeart,
//   FaCreditCard,
//   FaEdit,
//   FaSignOutAlt,
//   FaBook,
//   FaUserCircle,
// } from 'react-icons/fa';
// import { AuthContext } from '../../AuthContext/AuthContext.jsx';

// const ProfileDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);

//   const toggleDropdown = () => setIsOpen((prev) => !prev);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Close on route change
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   const handleLogout = () => {
//     logout(); // Clears token and updates context
//     navigate('/'); // Redirects to login page
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Circular button */}
//       <button
//         onClick={toggleDropdown}
//         className="w-10 h-10 bg-white text-green-700 rounded-full flex items-center justify-center hover:bg-green-100 transition duration-300"
//       >
//         <FaUserCircle className="text-2xl" />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl py-2 z-50">
//           <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaUser /> My Profile
//           </Link>
//           <Link to="/history" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaHistory /> History
//           </Link>
//           <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaBook /> My Bookings
//           </Link>
//           <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaHeart /> Wishlist
//           </Link>
//           <Link to="/transactions" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaCreditCard /> Transaction History
//           </Link>
//           <Link to="/edit-profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
//             <FaEdit /> Edit Profile
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
//           >
//             <FaSignOutAlt /> Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileDropdown;

