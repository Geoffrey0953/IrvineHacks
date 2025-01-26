import { useState } from 'react';
import axios from 'axios';


function App() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    // Validate that all fields are filled
    if (!startLocation || !destination || !budget || !travelers || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/plan_trip', {
        start_location: startLocation,
        destination: destination,
        budget: Number(budget),
        travelers: Number(travelers),
        start_date: startDate,
        end_date: endDate
      });
      
      console.log('Trip planning successful:', response.data);
    } catch (error) {
      console.error('Error planning trip:', error);
      alert('There was an error planning your trip. Please try again.');
    }
  };

  return (
    <>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-20 left-0 w-full h-[120vh] object-cover -z-10 scale-110"
      >
        <source src="/videos/globe-animation.mp4" type="video/mp4" />
      </video>

      <div className="min-h-screen relative">
        {/* Overlay to ensure content is readable */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50/60 via-red-50/50 to-amber-50/60 z-10" />

        {/* Main Content */}
        <div className="relative z-20">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-orange-900 mb-4">Plan Your Perfect Journey</h1>

              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-orange-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">Starting Location</label>
                      <input 
                        type="text" 
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        placeholder="Enter city or airport"
                        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">Destination</label>
                      <input 
                        type="text" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter city or airport"
                        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">Budget</label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm">$</span>
                        <input 
                          type="number" 
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="Enter budget"
                          min="0"
                          className="p-2 pl-6 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 w-full bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">Travelers</label>
                      <input 
                        type="number" 
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        placeholder="Enter number"
                        min="1"
                        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">From</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-orange-800 text-sm font-medium mb-1">To</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    className="mx-auto block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-6 rounded-md shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Plan My Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
