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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Travel Planner</h1>
            <p className="text-gray-600 text-lg">Let us help you plan your perfect journey</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Starting Location</label>
                <input 
                  type="text" 
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Enter city or airport"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Destination</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter city or airport"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter your budget"
                    min="0"
                    className="p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Number of Travelers</label>
                <input 
                  type="number" 
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  placeholder="Enter number of travelers"
                  min="1"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Travel Dates</label>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">From</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">To</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-8 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Plan My Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
