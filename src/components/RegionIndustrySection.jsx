import React from 'react';
import Dropdown from './Dropdown';
import SectionCard from './SectionCard';

const RegionIndustrySection = ({ inputs, handleInputChange, setCurrentStep, countrySettings, sectors, industryDefaults }) => (
    <SectionCard title="Region & Industry" color="orange" icon="🌍">
        <Dropdown label="Select Country" name="country" value={inputs.country} onChange={handleInputChange} options={Object.keys(countrySettings).map(c => ({value: c, label: c === 'AU' ? 'Australia' : 'United States'}))} placeholder="Select Country"/>
        <Dropdown label="Select Primary Sector" name="sector" value={inputs.sector} onChange={handleInputChange} options={Object.keys(sectors).map(sKey => ({value: sKey, label: sectors[sKey].name}))} placeholder="Select Primary Sector"/>
        {inputs.sector && sectors[inputs.sector]?.subSectors && (
            <Dropdown 
              label={`Select Sub-Sector for ${sectors[inputs.sector].name}`} 
              name="subSector" 
              value={inputs.subSector} 
              onChange={handleInputChange} 
              options={sectors[inputs.sector].subSectors.map(sub => ({value: sub, label: industryDefaults[inputs.country]?.[inputs.sector]?.[sub]?.name || sub }))} 
              placeholder="Select Sub-Sector (Optional)"
            />
        )}
        <button onClick={() => setCurrentStep(2)} disabled={!inputs.country || !inputs.sector} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">Next: Site Basics</button>
    </SectionCard>
);

export default RegionIndustrySection; 