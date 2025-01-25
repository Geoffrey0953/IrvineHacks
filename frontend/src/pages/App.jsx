import { useState } from 'react';

function App() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">AI Travel Planner</h1>
        <p className="text-gray-600 mb-8">Let us help you plan your perfect journey</p>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Starting Location</label>
            <input 
              type="text" 
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Enter starting point"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Destination</label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Budget</label>
            <input 
              type="number" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              min="0"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Number of Travelers</label>
            <input 
              type="number" 
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="Enter number of travelers"
              min="1"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Travel Dates</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">From</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Start date"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">To</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  min={startDate}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 mt-6">
            Plan My Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
