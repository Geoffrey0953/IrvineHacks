import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-orange-50/90 backdrop-blur-xl border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Name
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              to="/about" 
              className="text-orange-800 hover:text-orange-600 transition-colors duration-300"
            >
              About Us
            </Link>
            <Link 
              to="/team" 
              className="text-orange-800 hover:text-orange-600 transition-colors duration-300"
            >
              Our Team
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
