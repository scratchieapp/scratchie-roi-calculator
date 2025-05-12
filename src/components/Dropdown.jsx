import React from 'react';

const Dropdown = ({ label, name, value, onChange, options, helperText, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150"
        >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
);

export default Dropdown; 