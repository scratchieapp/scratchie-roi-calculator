import React from 'react';

const InputField = ({ label, name, value, onChange, type = "number", unit, helperText, step, min = "0", currencySymbol = '$' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center">
      {unit === "$" && <span className="text-gray-500 mr-2">{currencySymbol}</span>}
      <input
        type={type}
        name={name}
        id={name}
        value={value === null ? '' : value}
        onChange={onChange}
        step={step}
        min={min}
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150"
        placeholder={type === "number" ? "0" : ""}
      />
      {unit && unit !== "$" && <span className="ml-2 text-gray-500">{unit}</span>}
    </div>
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

export default InputField; 