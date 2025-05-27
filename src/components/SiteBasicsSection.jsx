import React from 'react';
import InputField from './InputField';
import SectionCard from './SectionCard';

const SiteBasicsSection = ({ inputs, handleInputChange, setCurrentStep, currencySymbol }) => {
    const isHospitality = inputs.sector === 'Hospitality';
    const isHotels = inputs.subSector === 'Hotels';
    
    let title = "Site/Project Basics";
    let icon = "🏗️";
    let workerLabel = "Peak Number of Workers (including subcontractors)";
    let hourlyRateLabel = "Average Worker Hourly Rate";
    
    if (isHospitality) {
        if (isHotels) {
            title = "Hotel Basics";
            icon = "🏨";
            workerLabel = "Peak Number of Staff";
            hourlyRateLabel = "Average Hourly Rate (Staff)";
        } else {
            title = "Restaurant Basics";
            icon = "🍴";
            workerLabel = "Peak Number of Crew";
            hourlyRateLabel = "Average Hourly Rate (Crew)";
        }
    }
    
    const workerHelperText = isHospitality 
        ? (isHotels 
            ? "Max number of staff members during peak operating hours." 
            : "Max number of crew members during peak operating hours.")
        : "Max number of workers on site/project at any time. For construction projects, we calculate based on a gradual ramp-up to this peak (10% month 1, 30% month 2, 60% month 3, 80% month 4, 100% from month 5). For non-project sectors like healthcare, this number remains constant.";

    return (
        <SectionCard title={title} color="blue" icon={icon}>
            <InputField 
                label={workerLabel} 
                name="peakNumWorkers" 
                value={inputs.peakNumWorkers} 
                onChange={handleInputChange} 
                unit="workers" 
                helperText={workerHelperText} 
                currencySymbol={currencySymbol}
            />
            <InputField 
                label="Calculation Period" 
                name="calculationPeriod" 
                value={inputs.calculationPeriod} 
                onChange={handleInputChange} 
                unit="months" 
                helperText="How long Scratchie will be on the site for (e.g., project duration or annual period)." 
                currencySymbol={currencySymbol}
            />
            <InputField 
                label={hourlyRateLabel} 
                name="workerHourlyRate" 
                value={inputs.workerHourlyRate} 
                onChange={handleInputChange} 
                unit="$" 
                helperText="Blended gross hourly rate for workers." 
                currencySymbol={currencySymbol}
            />
            <div className="flex justify-between mt-4">
                <button onClick={() => setCurrentStep(1)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
                <button onClick={() => setCurrentStep(3)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">Next: Safety & Program</button>
            </div>
        </SectionCard>
    );
};

export default SiteBasicsSection; 