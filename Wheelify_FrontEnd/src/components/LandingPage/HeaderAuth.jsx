import { Link } from 'react-router-dom';
import { FaBiking } from 'react-icons/fa';
import ProfileDropdown from './ProfileDropdown';

const HeaderAuth = () => {
  return (
    <header className="bg-gradient-to-r from-green-300 to-green-700 shadow-md">
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
          <Link to="/reviews" className="text-white hover:text-green-100 transition duration-300">Reviews</Link>
          <Link to="/how-it-works" className="text-white hover:text-green-100 transition duration-300">How It Works</Link>
          <Link to="/contact" className="text-white hover:text-green-100 transition duration-300">Contact</Link>
        </nav>

        {/* Profile Dropdown (circular, using your component) */}
        <div className="mr-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default HeaderAuth;
