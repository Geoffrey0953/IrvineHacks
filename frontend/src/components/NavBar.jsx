const Navbar = () => {
  return (
    <nav className="flex flex-wrap items-center justify-between py-4 px-8 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <a 
          className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
          href="/"
        >
          AI Travel Planner
        </a>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-6">
        <a href="about" 
          className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-300"
        >
          About
        </a>
        <a href="" 
          className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-300"
        >
          Contact
        </a>
        {/* <a href="https://linkedin.com/in/geoffrey-lee-525816236"
        className="relative bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text 
        text-transparent text-xl font-bold py-2 px-4 border border-transparent 
        rounded-lg hover:border-blue-600 transition-all duration-300 shadow-md 
        hover:shadow-lg hover:scale-105">
          Linkedin
        </a>
        <a href="https://github.com/Geoffrey0953"
        className="relative bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text 
        text-transparent text-xl font-bold py-2 px-4 border border-transparent 
        rounded-lg hover:border-blue-600 transition-all duration-300 shadow-md 
        hover:shadow-lg hover:scale-105">
          Github
        </a> */}
      </div>
    </nav>
  );
};

export default Navbar;
