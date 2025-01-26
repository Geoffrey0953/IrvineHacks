import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPlaneDeparture, FaPlaneArrival, FaUsers, FaCalendarAlt, FaDollarSign } from "react-icons/fa";

function App() {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState(null); // State for the itinerary

  const handleSubmit = async () => {
    if (!startLocation || !destination || !budget || !travelers || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }
  
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
      const itineraryText = response.data?.data?.content?.[0]?.text;
  
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
        const sortedItinerary = Object.entries(parsedItinerary)
          .sort(([keyA, valueA], [keyB, valueB]) => parseInt(valueA.Day, 10) - parseInt(valueB.Day, 10))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
  
        setItinerary(sortedItinerary); // Save the sorted itinerary to state
      } else {
        alert("Failed to parse itinerary.");
      }
    } catch (error) {
      console.error("Error planning trip:", error);
      alert("There was an error planning your trip. Please try again.");
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

      <div className="min-h-screen relative">
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-50/60 via-orange-50/50 to-amber-50/60 z-10" />

        <div className="relative z-20">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                {/* Animated Header */}
                <motion.h1
                  className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  Plan Your Perfect Journey
                </motion.h1>
              </div>

              {/* Form */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-orange-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Starting Location */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
                        Starting Location
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaPlaneDeparture className="text-yellow-500" />
                        <input
                          type="text"
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          placeholder="Enter city or airport"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300 w-full"
                        />
                      </div>
                    </div>
                    {/* Destination */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
                        Destination
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaPlaneArrival className="text-yellow-500" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter city or airport"
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300 w-full"
                        />
                      </div>
                    </div>
                    {/* Budget */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
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
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300 w-full"
                        />
                      </div>
                    </div>
                    {/* Travelers */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
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
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 placeholder-orange-300 w-full"
                        />
                      </div>
                    </div>
                    {/* Dates */}
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
                        From
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-yellow-500" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col relative">
                      <label className="text-orange-800 text-sm font-medium mb-1">
                        To
                      </label>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-yellow-500" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
                          className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-orange-900 w-full"
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
                  <div className="space-y-4">
                    {Object.entries(itinerary).map(([key, details]) => (
                      <div key={key} className="p-4 bg-orange-50 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-orange-800">
                          Day {details["Day"]}, {details["Block"]}
                        </p>
                        <p className="text-lg font-semibold">{details["Activity"]}</p>
                        <p className="text-sm text-gray-700">{details["Location"]}</p>
                        <p className="text-sm text-gray-500">{details["Details"]}</p>
                        <p className="text-sm text-gray-700">
                          Time: {details["Time"]} | Cost: {details["Cost"]}
                        </p>
                      </div>
                    ))}
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