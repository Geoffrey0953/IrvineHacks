import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // For animations
import { FaPlaneDeparture, FaPlaneArrival, FaUsers, FaCalendarAlt, FaDollarSign } from "react-icons/fa"; // For icons
import airplaneIcon from '../assets/airplane-cartoon.png'; // Add your cartoon airplane image
import earthIcon from '../assets/earth-cartoon.png'; // Add your cartoon earth image
import Autocomplete from '../components/scripts.jsx'
import city_names from '../components/city_names.jsx'

function App() {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null); // State for the itinerary

  const handleSubmit = async () => {
    if (!startLocation || !destination || !budget || !travelers || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await axios.post("http://127.0.0.1:5000/plan_trip", {
        start_location: startLocation,
        destination: destination,
        budget: Number(budget),
        travelers: Number(travelers),
        start_date: startDate,
        end_date: endDate,
      });
  
      console.log("Trip planning successful:", response.data);
  
      // Extract and process the itinerary JSON string
      const itineraryText = response.data?.data?.[0]?.content?.[0]?.text;
  
      if (itineraryText) {
        // Clean and fix the JSON string
        const fixedItineraryText = itineraryText
          .replace(/\[/g, '{') // Replace all '[' with '{'
          .replace(/\]/g, '}') // Replace all ']' with '}'
          .replace(/\\\"/g, '"') // Fix escaped quotes
          .replace(/"{/g, '{') // Remove misplaced quotes
          .replace(/}"/g, '}'); // Remove misplaced quotes
  
        const parsedItinerary = JSON.parse(`{${fixedItineraryText}}`); // Parse the cleaned string
  
        // Sort by Day to ensure chronological order
        const groupedItinerary = Object.entries(parsedItinerary).reduce((acc, [key, value]) => {
          const day = value.Day;
          if (!acc[day]) acc[day] = [];
          acc[day].push(value); // Group all activities for the same day
          return acc;
        }, {});
  
        setItinerary(groupedItinerary); // Save the sorted itinerary to state
      } else {
        alert("Failed to parse itinerary.");
      }
    } catch (error) {
      console.error("Error planning trip:", error);
      alert("There was an error planning your trip. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };  

  return (
    <>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-screen object-cover -z-10 scale-110"
      >
        <source src="/videos/globe-animation.mp4" type="video/mp4" />
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {/* Earth in the center */}
              <img 
                src={earthIcon} 
                alt="Earth" 
                className="absolute w-20 h-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              {/* Dashed circle path */}
              <div className="absolute inset-0 border-4 border-dashed border-orange-300 rounded-full"></div>
              {/* Rotating airplane */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <img 
                  src={airplaneIcon} 
                  alt="Airplane" 
                  className="absolute w-10 h-10 left-1/2 -translate-x-1/2 -top-5"
                />
              </div>
            </div>
            <p className="text-orange-800 font-medium">Planning your perfect trip...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen relative">
        <div className="relative z-20">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                {/* Animated Header */}
                <motion.h1
                  className="text-5xl font-extrabold mb-2"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <span className="text-gray-700">
                    Plan Your Trip Around The{" "}
                  </span>
                  <span className="bg-gradient-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    Planit
                  </span>
                </motion.h1>
              </div>

              {/* Form */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-orange-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Starting Location */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        Starting Location
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaPlaneDeparture className="text-yellow-500" />
                        <Autocomplete
                          suggestions={city_names}
                          id='destination'
                          type="text"
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          placeholder="Enter city or airport"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500 w-full"
                        />
                        <div className="absolute z-10 border border-gray-300 border-t-0 w-full">
                        </div>
                      </div>
                    </div>
                    {/* Destination */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        Destination
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaPlaneArrival className="text-yellow-500" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter city or airport"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500 w-full"
                        />
                      </div>
                    </div>
                    {/* Budget */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        Budget
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaDollarSign className="text-yellow-500" />
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="Enter budget"
                          min="0"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500 w-full"
                        />
                      </div>
                    </div>
                    {/* Travelers */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        Travelers
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaUsers className="text-yellow-500" />
                        <input
                          type="number"
                          value={travelers}
                          onChange={(e) => setTravelers(e.target.value)}
                          placeholder="Enter number"
                          min="1"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500 w-full"
                        />
                      </div>
                    </div>
                    {/* Dates */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        From
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-yellow-500" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1 pl-7">
                        To
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-yellow-500" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black w-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <motion.button
                    onClick={handleSubmit}
                    className="mx-auto block bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium py-2 px-6 rounded-md shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Plan My Trip
                  </motion.button>
                </div>
              </div>

              {/* Itinerary Display */}
              {itinerary && (
                <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                  <h2 className="text-lg font-bold mb-4 text-orange-500">Your Itinerary</h2>
                  
                  {/* Trip Summary */}
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-md font-semibold text-orange-800 mb-2">Trip Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Flight Cost</p>
                        <p className="text-lg font-bold text-orange-600">${Number(itinerary[1][0]?.Cost?.split(' ')[0].replace('$', '') * 2).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Hotel Cost</p>
                        <p className="text-lg font-bold text-orange-600">
                          ${Number(itinerary[1]?.find(item => item.Activity === 'Hotel Stay')?.Cost?.split(' ')[0].replace('$', '') * 
                            Object.keys(itinerary).length).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-lg font-bold text-orange-600">{Object.keys(itinerary).length} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily Itinerary */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                      {Object.entries(itinerary).map(([day, activities]) => (
                        <div key={day} className="p-4 bg-orange-50 rounded-md shadow-sm w-80 flex-shrink-0">
                          <p className="text-lg font-bold text-orange-800 mb-3">Day {day}</p>
                          <div className="space-y-4">
                            {activities.sort((a, b) => {
                              // Custom sort order for blocks
                              const blockOrder = {
                                'Travel': 1,
                                'Accommodation': 2,
                                'Morning': 3,
                                'Afternoon': 4,
                                'Night': 5
                              };
                              return blockOrder[a.Block] - blockOrder[b.Block];
                            }).map((activity, index) => (
                              <div key={index} className="border-l-4 border-orange-300 pl-3">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-md font-semibold text-orange-900">{activity.Activity}</p>
                                  <span className="text-sm font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                                    {activity.Block}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{activity.Location}</p>
                                <p className="text-sm text-gray-600 mb-1">{activity.Details}</p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{activity.Time}</span>
                                  <span className="font-medium text-orange-600">{activity.Cost}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;