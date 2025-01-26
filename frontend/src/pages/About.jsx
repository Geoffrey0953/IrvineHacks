const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
            <p className="text-gray-600 text-lg">
              {/* Add your about us content here */}
              Welcome to our AI Travel Planner. We're dedicated to making your travel planning experience seamless and enjoyable...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 