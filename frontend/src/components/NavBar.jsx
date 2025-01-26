import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-rose-400 text-4xl font-bold hover:text-rose-500 transform hover:scale-110 transition-transform">
              Planit
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              to="/about" 
              className="text-rose-400 hover:text-rose-500 transition-colors duration-300 text-xl transform hover:scale-110 transition-transform"
            >
              About Us
            </Link>
            <Link 
              to="/team" 
              className="text-rose-400 hover:text-rose-500 transition-colors duration-300 text-xl transform hover:scale-110 transition-transform"
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
