import React from 'react';
import InputField from './InputField';
import SectionCard from './SectionCard';

const SiteBasicsSection = ({ inputs, handleInputChange, setCurrentStep, currencySymbol }) => (
    <SectionCard title="Site/Project Basics" color="blue" icon="🏗️">
        <InputField label="Peak Number of Workers (including subcontractors)" name="peakNumWorkers" value={inputs.peakNumWorkers} onChange={handleInputChange} unit="workers" helperText="Max number of workers on site/project at any time." currencySymbol={currencySymbol}/>
        <InputField label="Calculation Period" name="calculationPeriod" value={inputs.calculationPeriod} onChange={handleInputChange} unit="months" helperText="Duration for ROI calculation (e.g., project length or annual)." currencySymbol={currencySymbol}/>
        <InputField label="Average Worker Hourly Rate" name="workerHourlyRate" value={inputs.workerHourlyRate} onChange={handleInputChange} unit="$" helperText="Blended gross hourly rate for workers." currencySymbol={currencySymbol}/>
        <div className="flex justify-between mt-4">
            <button onClick={() => setCurrentStep(1)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
            <button onClick={() => setCurrentStep(3)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">Next: Safety & Program</button>
        </div>
    </SectionCard>
);

export default SiteBasicsSection; 