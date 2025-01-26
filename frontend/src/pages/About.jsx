const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Welcome to <b className="bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent">Planit</b>. We're dedicated to making your travel planning experience seamless, enjoyable, and stress-free. Our mission is to empower travelers with innovative technology that transforms the way you plan your adventures, creating unforgettable journeys tailored just for you.
              <br></br>
              <br></br>
              With our AI-powered platform, we take the hassle out of organizing your trip. By leveraging advanced AI models, we craft personalized travel itineraries based on your preferences, budget, and schedule. Whether you're seeking a relaxing getaway, an adventurous excursion, or a cultural exploration, our app ensures every detail of your trip is thoughtfully planned to meet your unique needs.
            </p>
            <br></br>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What We Offer</h2>
            <ul className="text-gray-600 text-lg leading-relaxed list-disc pl-6 space-y-3">
              <li>Customized Itineraries: Our AI generates a daily schedule that includes activities, attractions, and dining recommendations tailored to your interests.</li>
              <li>Budget-Friendly Options: We carefully balance affordability and quality, ensuring your dream trip fits within your budget.</li>
              <li>Seamless Planning: From flights to accommodations, we compile everything you need in one convenient place.</li>
            </ul>
            <br></br>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Us?</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
            Our app goes beyond ordinary travel planning. It's like having a personal travel expert in your pocket, ensuring every step of your journey is effortless and memorable. Whether you're traveling solo, with family, or with friends, we provide the perfect itinerary to suit your travel style.
            <br></br>
            <br></br>
            Let us handle the planning so you can focus on making memories. Your next adventure awaits—let's make it extraordinary!            </p>
            <div className="text-4xl text-center mt-8">✈️</div>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 