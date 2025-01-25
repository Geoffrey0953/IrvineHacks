import { useState } from 'react';
import Dropdown from '../components/Dropdown';

function App() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('');
  const [date, setDate] = useState('');

  const budgetOptions = [
    { value: 'budget', label: '$0 - $1000' },
    { value: 'moderate', label: '$1000 - $3000' },
    { value: 'luxury', label: '$3000+' }
  ];

  const travelerOptions = Array.from({ length: 8 }, (_, i) => {
    const num = i + 1;
    return {
      value: num,
      label: `${num} ${num === 1 ? 'person' : 'people'}`
    };
  });

  // Example locations - replace with your actual location options
  const locationOptions = [
    { value: 'nyc', label: 'New York City' },
    { value: 'london', label: 'London' },
    { value: 'tokyo', label: 'Tokyo' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">AI Travel Planner</h1>
        <p className="text-gray-600 mb-8">Let us help you plan your perfect journey</p>
        
        <div className="space-y-4">
          <Dropdown
            label="Starting Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            options={locationOptions}
            placeholder="Select starting point"
          />

          <Dropdown
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            options={locationOptions}
            placeholder="Select destination"
          />

          <Dropdown
            label="Budget Range"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            options={budgetOptions}
            placeholder="Select budget range"
          />

          <Dropdown
            label="Number of Travelers"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            options={travelerOptions}
            placeholder="Select number of travelers"
          />

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Travel Dates</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
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
