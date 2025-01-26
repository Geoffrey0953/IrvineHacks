import React, { useState } from "react";

const Autocomplete = ({ suggestions, onSelection }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = suggestions
        .filter((item) => item.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onSelection(suggestion); // Notify parent component of selection
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setInputValue(selectedSuggestion);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        onSelection(selectedSuggestion); // Notify parent component
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150); // Delay hiding suggestions
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="p-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-black placeholder-gray-500 w-full"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Type to search..."
      />
      {showSuggestions && (
        <div className="absolute bg-white border mt-1 w-full z-10 rounded-md shadow-md">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`p-2 cursor-pointer ${
                index === activeSuggestionIndex ? "bg-orange-500 text-white" : "hover:bg-orange-100"
              }`}
              onMouseDown={() => handleClick(suggestion)} // Use onMouseDown to prevent blur event
            >
              <strong>{suggestion.substr(0, inputValue.length)}</strong>
              {suggestion.substr(inputValue.length)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
