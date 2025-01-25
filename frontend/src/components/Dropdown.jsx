const Dropdown = ({ label, value, onChange, options, placeholder }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 mb-2">{label}</label>
      <select 
        value={value}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown; 