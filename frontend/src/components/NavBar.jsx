import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">

            <Link to="/" className="bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent text-4xl font-bold transform hover:scale-110 transition-colors duration-300 transition-transform">


              Planit
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              to="/about" 

              className="bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent transition-colors duration-300 text-xl transform hover:scale-110 transition-transform"

            >
              Our Mission
            </Link>
            <Link 
              to="/team" 

              className="bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent transition-colors duration-300 text-xl transform hover:scale-110 transition-transform"

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
