import React from 'react';
import InputField from './InputField';
import SectionCard from './SectionCard';

const EfficiencyImpactSection = ({ inputs, handleInputChange, setCurrentStep, currencySymbol }) => (
    <SectionCard title="Efficiency & Impact Factors" color="green" icon="⏱️">
        <InputField label="Time Saved per Digital Hazard Report" name="timePerHazard" value={inputs.timePerHazard} onChange={handleInputChange} unit="minutes" helperText="Compared to manual reporting / Take5 / Start Card etc." currencySymbol={currencySymbol}/>
        <InputField label="Expected Monthly Hazard Reports per Worker (with Scratchie)" name="reportsPerWorker" value={inputs.reportsPerWorker} onChange={handleInputChange} unit="reports" helperText="Typically 2-10x increase. Default: 10." step="0.1" currencySymbol={currencySymbol}/>
        <InputField label="Admin Hours Saved Monthly (by Platform)" name="adminHoursSaved" value={inputs.adminHoursSaved} onChange={handleInputChange} unit="hours" helperText="Time saved on safety admin tasks." currencySymbol={currencySymbol}/>
        <div className="flex justify-between mt-4">
            <button onClick={() => setCurrentStep(3)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
            <button onClick={() => setCurrentStep(5)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">View ROI Summary</button>
        </div>
    </SectionCard>
);

export default EfficiencyImpactSection; 