import React, { useState } from 'react';
import InputField from './InputField';
import CheckboxField from './CheckboxField';
import SectionCard from './SectionCard';

const SafetyProgramSection = ({ inputs, handleInputChange, setCurrentStep, trirUnit, currencySymbol }) => {
    const isHospitality = inputs.sector === 'Hospitality';
    const isHotels = inputs.subSector === 'Hotels';
    const [showSafetyInfo, setShowSafetyInfo] = useState(false);
    
    let incidentRateHelperText = "Your site's TRIR. Suggested based on sector.";
    if (isHospitality) {
        if (isHotels) {
            incidentRateHelperText = "Your hotel's Lost Time Injury Frequency Rate. Suggested based on sector.";
        } else {
            incidentRateHelperText = "Your restaurant's Lost Time Injury Frequency Rate. Suggested based on sector.";
        }
    }
    
    return (
        <div className="space-y-6">
            {isHospitality && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <button 
                        onClick={() => setShowSafetyInfo(!showSafetyInfo)}
                        className="w-full text-left flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                        <span>How do safety metrics improve with Scratchie?</span>
                        <span className="text-lg">{showSafetyInfo ? '−' : '+'}</span>
                    </button>
                    
                    {showSafetyInfo && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-700 mb-2">
                                Encouraging safety through Scratchie and Convo Cards creates measurable engagement improvements that directly correlate with reduced workplace incidents. 
                                When crew members feel recognized for proactive safety behaviors, they become more vigilant and committed to maintaining safe practices.
                            </p>
                            <div className="bg-white p-3 rounded border-l-2 border-orange-400 mt-3">
                                <p className="text-xs font-semibold text-gray-800 mb-1">For a typical Quick Service Restaurant with 50 employees:</p>
                                <p className="text-xs text-gray-700">Annual LTI probability: 8.7% (industry average)</p>
                                <p className="text-xs text-gray-700">Expected annual cost: $86,066 × 0.087 = $7,500 per outlet</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">
                                *These estimates exclude latent costs from workers' compensation premium increases, which typically rise 12-18% after an LTI claim. 
                                Premium adjustments persist for 3-5 years, creating long-term financial impacts beyond initial claim resolution.
                            </p>
                        </div>
                    )}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard title="Current Safety Metrics" color="red" icon="⚠️">
                    <InputField label={`Current Incident Rate (${trirUnit})`} name="incidentRate" value={inputs.incidentRate} onChange={handleInputChange} helperText={incidentRateHelperText} step="0.1" currencySymbol={currencySymbol}/>
                    <InputField label="Average Cost Per Incident" name="costPerIncident" value={inputs.costPerIncident} onChange={handleInputChange} unit="$" helperText="Total direct/indirect costs. Suggested based on sector." currencySymbol={currencySymbol}/>
                    <InputField 
                        label="Expected Incident Reduction with Scratchie" 
                        name="incidentReduction" 
                        value={inputs.incidentReduction} 
                        onChange={handleInputChange} 
                        unit="%" 
                        helperText={
                            <>
                                Research-backed range: 20-50%. {' '}
                                <a 
                                    href="https://www.thecampbellinstitute.org/wp-content/uploads/2017/05/Campbell-Institute-Practical-Guide-Leading-Indicators-WP.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    See Campbell Institute research
                                </a>
                            </>
                        } 
                        currencySymbol={currencySymbol}
                    />
                </SectionCard>
                <SectionCard title="Recognition Program Setup" color="purple" icon="🏆">
                    <InputField label="Monthly Cash Reward Budget per Worker" name="rewardBudget" value={inputs.rewardBudget} onChange={handleInputChange} unit="$" helperText="$5-50 recommended. Includes processing fees." currencySymbol={currencySymbol}/>
                    <CheckboxField label="Include On-Site Scratchie Training?" name="includeOnSiteTraining" checked={inputs.includeOnSiteTraining} onChange={handleInputChange} helperText={`Adds one-time cost (e.g., ${currencySymbol}${inputs.country === 'AU' ? '2,000' : '1,500'}).`}/>
                    <InputField label="Admin Setup Hours (One-time)" name="adminHours" value={inputs.adminHours} onChange={handleInputChange} unit="hours" helperText="Internal time for initial setup." currencySymbol={currencySymbol}/>
                    <InputField label="Admin Hourly Rate" name="adminRate" value={inputs.adminRate} onChange={handleInputChange} unit="$" helperText="For setup cost & ongoing admin time savings. Suggested: $45/hr." currencySymbol={currencySymbol}/>
                </SectionCard>
            </div>
            <div className="flex justify-between mt-4">
                <button onClick={() => setCurrentStep(2)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg">Back</button>
                <button onClick={() => setCurrentStep(4)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">Next: Efficiency</button>
            </div>
        </div>
    );
};

export default SafetyProgramSection; 