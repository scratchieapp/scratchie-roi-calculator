import React from 'react';
import InputField from './InputField';
import SectionCard from './SectionCard';

const EfficiencyImpactSection = ({ inputs, handleInputChange, setCurrentStep, currencySymbol }) => (
    <SectionCard title="Efficiency & Impact Factors" color="green" icon="⏱️">
        <InputField label="Time Saved per Digital Hazard Report" name="timePerHazard" value={inputs.timePerHazard} onChange={handleInputChange} unit="minutes" helperText="Compared to manual reporting / Take5 / Start Card / Donesafe etc." currencySymbol={currencySymbol}/>
        <InputField label="Expected Convo Card Hazard ID Reports per Worker each month" name="reportsPerWorker" value={inputs.reportsPerWorker} onChange={handleInputChange} unit="reports" helperText="Typically 2-10x increase. Default: 10." step="0.1" currencySymbol={currencySymbol}/>
        <InputField label="Admin Hours Saved Weekly (by Platform)" name="adminHoursSaved" value={inputs.adminHoursSaved} onChange={handleInputChange} unit="hours" helperText="Time saved on weekly safety admin tasks." currencySymbol={currencySymbol}/>
        <div className="mt-4">
            <label htmlFor="productivityGainPercent" className="block text-sm font-medium text-gray-700 mb-1">Productivity Gain (%)</label>
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    id="productivityGainPercent"
                    name="productivityGainPercent"
                    min="0"
                    max="20"
                    step="0.1"
                    value={inputs.productivityGainPercent}
                    onChange={handleInputChange}
                    className="w-full"
                />
                <span className="text-sm text-gray-700 font-semibold" style={{minWidth: 40}}>{inputs.productivityGainPercent}%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Adjust the expected productivity gain from Scratchie (conservative suggestion: 3%).<br />
                <a href="https://www.scratchie.com/post/productivity-gains-workplace-recognition-data" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">See expected productivity boosts by industry</a>
            </p>
        </div>
        <div className="flex justify-between mt-4">
            <button onClick={() => setCurrentStep(3)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
            <button onClick={() => setCurrentStep(5)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">View ROI Summary</button>
        </div>
    </SectionCard>
);

export default EfficiencyImpactSection; 