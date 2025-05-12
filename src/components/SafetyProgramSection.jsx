import React from 'react';
import InputField from './InputField';
import CheckboxField from './CheckboxField';
import SectionCard from './SectionCard';

const SafetyProgramSection = ({ inputs, handleInputChange, setCurrentStep, trirUnit, currencySymbol }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Current Safety Metrics" color="red" icon="⚠️">
            <InputField label={`Current Incident Rate (${trirUnit})`} name="incidentRate" value={inputs.incidentRate} onChange={handleInputChange} helperText="Your site's TRIR. Suggested based on sector." step="0.1" currencySymbol={currencySymbol}/>
            <InputField label="Average Cost Per Incident" name="costPerIncident" value={inputs.costPerIncident} onChange={handleInputChange} unit="$" helperText="Total direct/indirect costs. Suggested based on sector." currencySymbol={currencySymbol}/>
            <InputField label="Expected Incident Reduction with Scratchie" name="incidentReduction" value={inputs.incidentReduction} onChange={handleInputChange} unit="%" helperText="Typical range: 18-30%." currencySymbol={currencySymbol}/>
        </SectionCard>
        <SectionCard title="Recognition Program Setup" color="purple" icon="🏆">
            <InputField label="Monthly Cash Reward Budget per Worker" name="rewardBudget" value={inputs.rewardBudget} onChange={handleInputChange} unit="$" helperText="$5-50 recommended. Includes processing fees." currencySymbol={currencySymbol}/>
            <CheckboxField label="Include On-Site Scratchie Training?" name="includeOnSiteTraining" checked={inputs.includeOnSiteTraining} onChange={handleInputChange} helperText={`Adds one-time cost (e.g., ${currencySymbol}${inputs.country === 'AU' ? '2,000' : '1,500'}).`}/>
            <InputField label="Admin Setup Hours (One-time)" name="adminHours" value={inputs.adminHours} onChange={handleInputChange} unit="hours" helperText="Internal time for initial setup." currencySymbol={currencySymbol}/>
            <InputField label="Admin Hourly Rate" name="adminRate" value={inputs.adminRate} onChange={handleInputChange} unit="$" helperText="For setup cost & ongoing admin time savings." currencySymbol={currencySymbol}/>
        </SectionCard>
        <div className="md:col-span-2 flex justify-between mt-2">
            <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
            <button onClick={() => setCurrentStep(4)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">Next: Efficiency</button>
        </div>
    </div>
);

export default SafetyProgramSection; 