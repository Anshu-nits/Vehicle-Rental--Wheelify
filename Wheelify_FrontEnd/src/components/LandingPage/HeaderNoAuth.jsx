import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaBiking } from 'react-icons/fa';

const HeaderNoAuth = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-300 to-green-700 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* Logo with Link to Home */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
            <FaBiking className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-900">Wheelify</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 flex justify-center gap-x-10">
          <Link to="/" className="text-white hover:text-green-100 transition-colors duration-300">
            Home
          </Link>
          <HashLink smooth to="/#reviews" className="text-white hover:text-green-100 transition-colors duration-300">
            Reviews
          </HashLink>
          <HashLink smooth to="/#how-it-works" className="text-white hover:text-green-100 transition-colors duration-300">
            How It Works
          </HashLink>
          <HashLink smooth to="/#about-us" className="text-white hover:text-green-100 transition-colors duration-300">
            About Us
          </HashLink>
          <HashLink smooth to="/#contact-us" className="text-white hover:text-green-100 transition-colors duration-300">
            Contact
          </HashLink>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-2 flex items-center">
          <Link to="/login">
            <button className="w-28 h-10 bg-green-400 text-white rounded-md hover:bg-green-500 transition-colors duration-300">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-28 h-10 bg-white text-green-700 border border-green-700 rounded-md hover:bg-green-100 transition-colors duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderNoAuth;