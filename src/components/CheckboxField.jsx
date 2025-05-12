import React from 'react';

const CheckboxField = ({ label, name, checked, onChange, helperText }) => (
    <div className="flex items-start">
        <div className="flex items-center h-5">
            <input id={name} name={name} type="checkbox" checked={checked} onChange={onChange} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"/>
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={name} className="font-medium text-gray-700">{label}</label>
            {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
        </div>
    </div>
);

export default CheckboxField; 