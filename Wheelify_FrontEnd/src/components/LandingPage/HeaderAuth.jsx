import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaBiking, FaShoppingCart } from 'react-icons/fa';
import ProfileDropdown from './ProfileDropdown';

const HeaderAuth = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-300 to-green-700 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
            <FaBiking className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-900">Wheelify</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 flex justify-center gap-x-10">
          <Link to="/" className="text-white hover:text-green-100 transition duration-300">Home</Link>
          <Link to="/bikes" className="text-white hover:text-green-100 transition duration-300">Bikes</Link>
          <HashLink smooth to="/#reviews" className="text-white hover:text-green-100 transition duration-300">Reviews</HashLink>
          <HashLink smooth to="/#how-it-works" className="text-white hover:text-green-100 transition duration-300">How It Works</HashLink>
          <HashLink smooth to="/#contact-us" className="text-white hover:text-green-100 transition duration-300">Contact</HashLink>
        </nav>

        {/* Cart and Profile */}
        <div className="flex items-center gap-4 mr-2">
          <Link to="/cart" className="w-10 h-10 flex items-center justify-center bg-white text-green-600 rounded-full shadow hover:shadow-md transition duration-300">
            <FaShoppingCart className="text-xl" />
          </Link>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default HeaderAuth;