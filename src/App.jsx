// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { countrySettings } from './data/countrySettings';
import { industryDefaults } from './data/industryDefaults';
import { sectors } from './data/sectors';
import RegionIndustrySection from './components/RegionIndustrySection';
import SiteBasicsSection from './components/SiteBasicsSection';
import SafetyProgramSection from './components/SafetyProgramSection';
import EfficiencyImpactSection from './components/EfficiencyImpactSection';
import ROISummarySection from './components/ROISummarySection';
import Header from './components/Header';
import './index.css';

console.log('App loaded');
console.log('jsPDF:', jsPDF);
console.log('jsPDF.API:', jsPDF.API);
console.log('autoTable on API:', typeof jsPDF.API?.autoTable);

// Constants for brand colors
const SCRATCHIE_ORANGE = '#F97115';
const SCRATCHIE_GREEN = '#4DB360'; // Main green for positive outcomes
const SCRATCHIE_BRIGHT_GREEN = '#10B981'; // Brighter green for "Excellent" ROI
const SCRATCHIE_TEXT_DARK = '#170E0A';
const SCRATCHIE_TEXT_GRAY = '#4A5568';
const SCRATCHIE_TEXT_LIGHT_GRAY = '#718096';

// --- Helper Functions ---
const formatCurrency = (value, currencyCode = 'AUD', symbol = '$') => {
    if (isNaN(value) || value === null) return `${symbol}0.00`;
    return new Intl.NumberFormat(currencyCode === 'AU' || currencyCode === 'AUD' ? 'en-AU' : 'en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const formatCurrencyNoCents = (value, currencyCode = 'AUD', symbol = '$') => {
    if (isNaN(value) || value === null) return `${symbol}0`;
    return new Intl.NumberFormat(currencyCode === 'AU' || currencyCode === 'AUD' ? 'en-AU' : 'en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value, decimals = 2) => {
    if (value === Infinity) return "∞";
    if (isNaN(value) || value === null) return '0';
    return new Intl.NumberFormat('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
};

// --- Component: InputField ---
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

// --- Component: CheckboxField ---
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

// --- Component: SectionCard ---
const SectionCard = ({ title, sectionNumber, children, color = "orange", icon, className = "" }) => {
  const borderColors = { orange: 'border-orange-500', red: 'border-red-500', blue: 'border-blue-500', green: 'border-green-500', purple: 'border-purple-500', gray: 'border-gray-500'};
  const textColors = { orange: 'text-orange-600', red: 'text-red-600', blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600', gray: 'text-gray-700'};
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border-t-4 ${borderColors[color]} ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-2xl" style={{color: SCRATCHIE_ORANGE}}>{icon}</div>}
        <h2 className={`text-xl font-semibold ${textColors[color]}`}>
          {sectionNumber && `${sectionNumber}. `}{title}
        </h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

// --- Component: Dropdown ---
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

// Helper function to calculate effective worker count for a given month
const getEffectiveWorkerCount = (peakWorkers, month, sector) => {
  if (sector !== 'construction') return peakWorkers;
  
  const rampUpPercentages = [0.1, 0.3, 0.6, 0.8, 1.0];
  const monthIndex = Math.min(month, 4);
  return peakWorkers * rampUpPercentages[monthIndex];
};

// Helper function to calculate average worker count over the calculation period
const getAverageWorkerCount = (peakWorkers, calculationPeriod, sector) => {
  if (sector !== 'construction') return peakWorkers;
  
  let totalWorkers = 0;
  for (let month = 0; month < calculationPeriod; month++) {
    totalWorkers += getEffectiveWorkerCount(peakWorkers, month, sector);
  }
  return totalWorkers / calculationPeriod;
};

// --- Main Calculator Component ---
const ScratchieROICalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState({
    country: 'AU',
    sector: '',
    subSector: '',
    peakNumWorkers: 100,
    calculationPeriod: 12,
    workerHourlyRate: null,
    incidentRate: null,
    costPerIncident: null,
    incidentReduction: 20,
    rewardBudget: 10,
    includeOnSiteTraining: false,
    adminHours: 10,
    adminRate: null,
    timePerHazard: 10,
    reportsPerWorker: 10,
    adminHoursSaved: 4,
    productivityGainPercent: 1.5,
  });

  const [results, setResults] = useState({
     platformFee: 0, rewardBudgetTotal: 0, trainingCost: 0, adminSetupCost: 0, totalImplementationCost: 0,
     annualWorkHours: 0, expectedIncidentsCurrent: 0, expectedIncidentsWithScratchie: 0, incidentsPrevented: 0, incidentCostSavings: 0,
     totalMonthlyReports: 0, totalTimeSavedHours: 0, hazardReportingValue: 0, adminTimeSavingsTotal: 0, productivityGain: 0,
     totalBenefits: 0, netBenefit: 0, roi: 0, paybackPeriod: 0, benefitCostRatio: 0,
     calc_incidentCostSavings: '', calc_hazardReportingValue: '', calc_adminTimeSavingsTotal: '', calc_productivityGain: ''
  });
  const [currency, setCurrency] = useState(countrySettings.AU.currency);
  const [currencySymbol, setCurrencySymbol] = useState(countrySettings.AU.currencySymbol);
  const [trirUnit, setTrirUnit] = useState(countrySettings.AU.trirUnit);

  useEffect(() => {
    const countryConf = countrySettings[inputs.country];
    setCurrency(countryConf.currency);
    setCurrencySymbol(countryConf.currencySymbol);
    setTrirUnit(countryConf.trirUnit);

    setInputs(prev => ({
        ...prev,
        workerHourlyRate: prev.workerHourlyRate === null ? (inputs.country === 'AU' ? 45 : 35) : prev.workerHourlyRate,
        adminRate: prev.adminRate === null ? 45 : prev.adminRate,
        // Reset sector-specific values if country changes and they were potentially from old country's defaults
        // This might be too aggressive, depends on desired UX. For now, let sector useEffect handle it.
    }));
  }, [inputs.country]);

  useEffect(() => {
    if (!inputs.country || !inputs.sector) {
      // Optionally reset incidentRate and costPerIncident if sector is cleared
      // setInputs(prev => ({ ...prev, incidentRate: null, costPerIncident: null }));
      return;
    }

    const countryDefaults = industryDefaults[inputs.country];
    if (!countryDefaults) return;

    let sectorData = countryDefaults[inputs.sector];
    if (!sectorData) return;

    let specificDefaults = null;
    if (inputs.subSector && sectorData[inputs.subSector]) {
        specificDefaults = sectorData[inputs.subSector];
    } else if (sectorData.default) {
        specificDefaults = sectorData.default;
    }

    if (specificDefaults) {
        setInputs(prev => ({
            ...prev,
            incidentRate: specificDefaults.trir !== undefined ? specificDefaults.trir : prev.incidentRate,
            costPerIncident: specificDefaults.cost !== undefined ? specificDefaults.cost : prev.costPerIncident,
        }));
    }
  }, [inputs.country, inputs.sector, inputs.subSector]);

  // Set sector-specific defaults for hospitality
  useEffect(() => {
    if (inputs.sector === 'Hospitality') {
        const workerRate = inputs.subSector === 'FSR' ? 35 : 28;
        setInputs(prev => ({
            ...prev,
            workerHourlyRate: workerRate,
            adminRate: prev.adminRate === null ? 45 : prev.adminRate,
        }));
    }
  }, [inputs.sector, inputs.subSector]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let valToSet;

    if (type === 'checkbox') {
        valToSet = checked;
    } else if (type === 'number') {
        valToSet = value === '' ? null : parseFloat(value);
    } else {
        valToSet = value;
    }

    setInputs(prev => {
        const newInputs = { ...prev, [name]: valToSet };
        if (name === 'sector' && prev.sector !== valToSet) { // Check if sector actually changed
            newInputs.subSector = ''; // Reset subSector only if sector changes
            // Potentially load new defaults here or let the useEffect handle it
        }
        return newInputs;
    });
  };

  useEffect(() => {
    const {
      peakNumWorkers, calculationPeriod, workerHourlyRate, incidentRate, costPerIncident,
      incidentReduction, rewardBudget, includeOnSiteTraining, adminHours, adminRate,
      timePerHazard, reportsPerWorker, adminHoursSaved, country, sector
    } = inputs;

    const safePeakNumWorkers = parseFloat(peakNumWorkers) || 0;
    const safeCalculationPeriod = parseFloat(calculationPeriod) || 0;
    const safeWorkerHourlyRate = parseFloat(workerHourlyRate) || 0;
    const safeIncidentRate = parseFloat(incidentRate) || 0;
    const safeCostPerIncident = parseFloat(costPerIncident) || 0;
    const safeIncidentReduction = parseFloat(incidentReduction) || 0;
    const safeRewardBudget = parseFloat(rewardBudget) || 0;
    const safeAdminHours = parseFloat(adminHours) || 0;
    const safeAdminRate = parseFloat(adminRate) || 0;
    const safeTimePerHazard = parseFloat(timePerHazard) || 0;
    const safeReportsPerWorker = parseFloat(reportsPerWorker) || 0;
    const safeAdminHoursSaved = parseFloat(adminHoursSaved) || 0;

    const currentCountrySettings = countrySettings[country];
    const averageWorkerCount = getAverageWorkerCount(safePeakNumWorkers, safeCalculationPeriod, sector);

    const platformFee = averageWorkerCount * 5 * safeCalculationPeriod;
    const rewardBudgetTotal = averageWorkerCount * safeRewardBudget * safeCalculationPeriod;
    const trainingCost = includeOnSiteTraining ? (country === 'AU' ? 2000 : 1500) : 0;
    const adminSetupCost = safeAdminHours * safeAdminRate;
    const totalImplementationCost = platformFee + rewardBudgetTotal + trainingCost + adminSetupCost;

    const annualWorkHoursPerWorker = 2000;
    const totalWorkHoursForPeriod = averageWorkerCount * annualWorkHoursPerWorker * (safeCalculationPeriod / 12);
    const expectedIncidentsCurrent = currentCountrySettings.trirDenominator > 0 ? (totalWorkHoursForPeriod / currentCountrySettings.trirDenominator) * safeIncidentRate : 0;
    const expectedIncidentsWithScratchie = expectedIncidentsCurrent * (1 - (safeIncidentReduction / 100));
    const incidentsPrevented = expectedIncidentsCurrent - expectedIncidentsWithScratchie;
    const incidentCostSavings = incidentsPrevented * safeCostPerIncident;

    const totalMonthlyReports = averageWorkerCount * safeReportsPerWorker;
    const totalTimeSavedHours = (totalMonthlyReports * safeTimePerHazard * safeCalculationPeriod) / 60;
    const hazardReportingValue = totalTimeSavedHours * safeWorkerHourlyRate;
    const adminTimeSavingsTotal = safeAdminHoursSaved * 4 * safeAdminRate * safeCalculationPeriod; // Multiply by 4 to convert weekly to monthly
    const monthlyWorkHoursPerWorker = 160;
    const totalLaborCostForProductivity = averageWorkerCount * safeCalculationPeriod * monthlyWorkHoursPerWorker * safeWorkerHourlyRate;
    const productivityGain = totalLaborCostForProductivity * (parseFloat(inputs.productivityGainPercent) / 100);

    const totalBenefits = incidentCostSavings + hazardReportingValue + adminTimeSavingsTotal + productivityGain;
    const netBenefit = totalBenefits - totalImplementationCost;
    const roi = totalImplementationCost > 0 ? (netBenefit / totalImplementationCost) * 100 : (totalBenefits > 0 ? Infinity : 0);
    
    const monthlyNetBenefit = safeCalculationPeriod > 0 ? (totalBenefits / safeCalculationPeriod) - (totalImplementationCost / safeCalculationPeriod) : 0;
    const paybackPeriod = (totalImplementationCost > 0 && monthlyNetBenefit > 0) ? totalImplementationCost / (totalBenefits / safeCalculationPeriod) : (totalImplementationCost === 0 && totalBenefits > 0 ? 0 : Infinity);
    // A more common payback: if monthlyBenefit (gross) is positive
    const monthlyGrossBenefit = safeCalculationPeriod > 0 ? totalBenefits / safeCalculationPeriod : 0;
    const paybackPeriodCalc = monthlyGrossBenefit > 0 ? totalImplementationCost / monthlyGrossBenefit : (totalImplementationCost === 0 && totalBenefits > 0 ? 0 : Infinity);

    const benefitCostRatio = totalImplementationCost > 0 ? totalBenefits / totalImplementationCost : (totalBenefits > 0 ? Infinity : 0);

    setResults({
      platformFee, rewardBudgetTotal, trainingCost, adminSetupCost, totalImplementationCost,
      annualWorkHours: totalWorkHoursForPeriod, expectedIncidentsCurrent, expectedIncidentsWithScratchie, incidentsPrevented, incidentCostSavings,
      totalMonthlyReports, totalTimeSavedHours, hazardReportingValue, adminTimeSavingsTotal, productivityGain,
      totalBenefits, netBenefit, roi, paybackPeriod: paybackPeriodCalc, benefitCostRatio,
      calc_incidentCostSavings: `${formatNumber(incidentsPrevented,2)} incidents prevented × ${formatCurrency(safeCostPerIncident, currency, currencySymbol)}/incident`,
      calc_hazardReportingValue: `${formatNumber(totalTimeSavedHours,1)} hrs saved × ${formatCurrency(safeWorkerHourlyRate, currency, currencySymbol)}/hr`,
      calc_adminTimeSavingsTotal: `${formatNumber(safeAdminHoursSaved,0)} hrs/month × ${formatCurrency(safeAdminRate, currency, currencySymbol)}/hr × ${formatNumber(safeCalculationPeriod,0)} months`,
      calc_productivityGain: `1.5% of total labor cost (${formatCurrency(totalLaborCostForProductivity, currency, currencySymbol)})`
    });
  }, [inputs, currency, currencySymbol]); // Added currencySymbol

  const sensitivityScenarios = [
    { name: 'Conservative', reduction: Math.max(0, (parseFloat(inputs.incidentReduction) || 0) - 10) },
    { name: 'Expected', reduction: parseFloat(inputs.incidentReduction) || 0 },
    { name: 'Optimistic', reduction: (parseFloat(inputs.incidentReduction) || 0) + 10 },
  ];

  const calculateSensitivityRoi = (reductionPercent) => {
    const {
      peakNumWorkers, calculationPeriod, workerHourlyRate, incidentRate, costPerIncident,
      adminHoursSaved, adminRate, timePerHazard, reportsPerWorker, country
    } = inputs;
    // results.totalImplementationCost might not be updated if inputs affecting it changed JUST before this func is called
    // For safety, recalculate totalImplementationCost or ensure it's stable when this is called.
    // Assuming totalImplementationCost from `results` state is correct for this context.
    const { platformFee, rewardBudgetTotal, trainingCost, adminSetupCost } = results; // Get components
    const currentTotalImplementationCost = platformFee + rewardBudgetTotal + trainingCost + adminSetupCost;


    const safePeakNumWorkers = parseFloat(peakNumWorkers) || 0;
    const safeCalculationPeriod = parseFloat(calculationPeriod) || 0;
    const safeWorkerHourlyRate = parseFloat(workerHourlyRate) || 0;
    const safeIncidentRate = parseFloat(incidentRate) || 0;
    const safeCostPerIncident = parseFloat(costPerIncident) || 0;
    const safeReductionPercent = parseFloat(reductionPercent) || 0;
    const safeAdminRate = parseFloat(adminRate) || 0;
    const safeTimePerHazard = parseFloat(timePerHazard) || 0;
    const safeReportsPerWorker = parseFloat(reportsPerWorker) || 0;
    const safeAdminHoursSaved = parseFloat(adminHoursSaved) || 0;

    const currentCountrySettings = countrySettings[country];

    const annualWorkHoursPerWorker = 2000;
    const totalWorkHoursForPeriod = safePeakNumWorkers * annualWorkHoursPerWorker * (safeCalculationPeriod / 12);
    const expectedIncidentsCurrent = currentCountrySettings.trirDenominator > 0 ? (totalWorkHoursForPeriod / currentCountrySettings.trirDenominator) * safeIncidentRate : 0;
    const expectedIncidentsWithScratchie = expectedIncidentsCurrent * (1 - (safeReductionPercent / 100));
    const incidentsPrevented = expectedIncidentsCurrent - expectedIncidentsWithScratchie;
    const scenarioIncidentCostSavings = incidentsPrevented * safeCostPerIncident;

    const totalMonthlyReports = safePeakNumWorkers * safeReportsPerWorker;
    const totalTimeSavedHours = (totalMonthlyReports * safeTimePerHazard * safeCalculationPeriod) / 60;
    const scenarioHazardReportingValue = totalTimeSavedHours * safeWorkerHourlyRate;
    const scenarioAdminTimeSavingsTotal = safeAdminHoursSaved * safeAdminRate * safeCalculationPeriod;
    const monthlyWorkHoursPerWorker = 160;
    const scenarioProductivityGain = safePeakNumWorkers * safeCalculationPeriod * monthlyWorkHoursPerWorker * safeWorkerHourlyRate * 0.015;

    const scenarioTotalBenefits = scenarioIncidentCostSavings + scenarioHazardReportingValue + scenarioAdminTimeSavingsTotal + scenarioProductivityGain;
    const scenarioNetBenefit = scenarioTotalBenefits - currentTotalImplementationCost; // Use re-derived or passed totalImplementationCost
    return currentTotalImplementationCost > 0 ? (scenarioNetBenefit / currentTotalImplementationCost) * 100 : (scenarioTotalBenefits > 0 ? Infinity : 0);
  };

  const getRoiRating = (roiValue) => {
     // Ensure you have defined 'bg-scratchie-bright-green' in your tailwind.config.js
     if (roiValue === Infinity) return { text: "Infinite ROI", className: "bg-green-600 text-white" };
     if (roiValue >= 200) return { text: "Excellent", className: "bg-scratchie-bright-green text-white" };
     if (roiValue >= 100) return { text: "Very Good", className: "bg-green-500 text-white" };
     if (roiValue >= 50) return { text: "Good", className: "bg-blue-500 text-white" };
     if (roiValue > 0) return { text: "Moderate", className: "bg-yellow-500 text-gray-800" };
     return { text: "Consider", className: "bg-orange-500 text-white" };
   };

  const generatePDF = () => {
     const doc = new jsPDF();
     console.log('doc:', doc);
     console.log('doc.autoTable:', typeof doc.autoTable);
     const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
     const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
     let currentY = 15;
 
     const _addText = (text, x, y, options = {}) => {
         const docPageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
         // More accurate line height calculation
         const fontSize = options.fontSize || 10;
         doc.setFontSize(fontSize); // Set font size before getting line height
         const lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor;
         
         const textLines = doc.splitTextToSize(text, options.maxWidth || (pageWidth - x - (options.marginRight || x)));
         const textBlockHeight = textLines.length * lineHeight * 0.9; // 0.9 is an adjustment factor, may need tuning
 
         if (y + textBlockHeight > docPageHeight - (options.marginBottom || 20) ) {
             doc.addPage();
             y = options.newY || 20; 
         }
         
         doc.setTextColor(options.color || SCRATCHIE_TEXT_GRAY);
         if (options.fontStyle) {
             doc.setFont(undefined, options.fontStyle);
         }
         doc.text(textLines, x, y, { align: options.align || 'left' });
         if (options.fontStyle) { 
             doc.setFont(undefined, 'normal');
         }
         return y + textBlockHeight + (options.spacingAfter || 2);
     };
     
     const _addSectionTitle = (title, y) => {
         const titleHeight = 12; 
         if (y + titleHeight > pageHeight - 20) { 
             doc.addPage();
             y = 20;
         }
         doc.setFontSize(14);
         doc.setFont(undefined, 'bold');
         doc.setTextColor(SCRATCHIE_TEXT_DARK);
         doc.text(title, 14, y);
         doc.setFont(undefined, 'normal');
         return y + 8; 
     };
 
     doc.setFontSize(20); doc.setTextColor(SCRATCHIE_ORANGE);
     doc.text("Scratchie ROI Business Case Summary", pageWidth / 2, currentY, { align: 'center' }); currentY += 8;
     
     currentY = _addText(`Country: ${inputs.country} | Currency: ${currency}`, 14, currentY, { fontSize: 10, color: SCRATCHIE_TEXT_GRAY });
     const sectorName = sectors[inputs.sector]?.name || "N/A";
     const subSectorName = inputs.subSector && industryDefaults[inputs.country]?.[inputs.sector]?.[inputs.subSector]?.name 
                         ? `(${industryDefaults[inputs.country][inputs.sector][inputs.subSector].name})` 
                         : "";
     currentY = _addText(`Sector: ${sectorName} ${subSectorName}`, 14, currentY, { fontSize: 10, color: SCRATCHIE_TEXT_GRAY });
     currentY = _addText(`Report Generated: ${new Date().toLocaleDateString(inputs.country === 'AU' ? 'en-AU' : 'en-US')}`, 14, currentY, { fontSize: 10, color: SCRATCHIE_TEXT_GRAY, spacingAfter: 7 });
 
     currentY = _addSectionTitle("Key Financial Projections", currentY);
     doc.autoTable({
         startY: currentY, theme: 'striped',
         head: [['Metric', 'Value']],
         body: [
             ['Total Investment', formatCurrency(results.totalImplementationCost, currency, currencySymbol)],
             ['Total Benefits (Over Period)', formatCurrency(results.totalBenefits, currency, currencySymbol)],
             ['Net Benefit', formatCurrency(results.netBenefit, currency, currencySymbol)],
             ['Return on Investment (ROI)', `${formatNumber(results.roi)}%`],
             ['Payback Period', `${results.paybackPeriod === Infinity ? "N/A" : formatNumber(results.paybackPeriod, 1) + ' months'}`],
             ['Benefit-Cost Ratio', `${results.benefitCostRatio === Infinity ? "Infinite" : formatNumber(results.benefitCostRatio)} : 1`],
         ],
         headStyles: { fillColor: SCRATCHIE_ORANGE, textColor: '#FFFFFF' },
         didDrawPage: (data) => { currentY = data.cursor.y + 5; }
     });
     if (doc.previousAutoTable && doc.previousAutoTable.finalY) currentY = doc.previousAutoTable.finalY + 10;
 
     currentY = _addSectionTitle("Core Inputs", currentY);
     currentY = Math.max(currentY, 20); // Ensure Y is not too low if previous table was short
     
     const isHospitality = inputs.sector === 'Hospitality';
     const peakWorkersLabel = isHospitality ? 'Peak Number of Crew' : 'Peak Number of Workers';
     
     doc.autoTable({
         startY: currentY, theme: 'grid', columnStyles: { 0: { cellWidth: 80 } },
         head: [['Parameter', 'Value']],
         body: [
             ['Calculation Period', `${formatNumber(inputs.calculationPeriod, 0)} months`],
             [peakWorkersLabel, formatNumber(inputs.peakNumWorkers, 0)],
             [`Avg. Worker Hourly Rate (${currencySymbol})`, formatCurrency(inputs.workerHourlyRate, currency, currencySymbol)],
             [`Current Incident Rate (${trirUnit})`, formatNumber(inputs.incidentRate, 1)],
             [`Avg. Cost per Incident (${currencySymbol})`, formatCurrency(inputs.costPerIncident, currency, currencySymbol)],
             ['Expected Incident Reduction', `${formatNumber(inputs.incidentReduction, 0)}%`],
             [`Monthly Cash Reward Budget/Worker (${currencySymbol})`, formatCurrency(inputs.rewardBudget, currency, currencySymbol)],
             ['On-Site Training', inputs.includeOnSiteTraining ? `Yes (${formatCurrency(results.trainingCost, currency, currencySymbol)})` : 'No'],
         ],
         headStyles: { fillColor: SCRATCHIE_TEXT_DARK, textColor: '#FFFFFF' },
         didDrawPage: (data) => { currentY = data.cursor.y + 5; }
     });
     if (doc.previousAutoTable && doc.previousAutoTable.finalY) currentY = doc.previousAutoTable.finalY + 10;
 
     currentY = _addSectionTitle("Implementation Costs Breakdown", currentY);
     currentY = Math.max(currentY, 20);
     doc.autoTable({
         startY: currentY, theme: 'striped',
         head: [['Cost Component', 'Amount']], // Added head for clarity
         body: [
             ['Platform Fee', formatCurrency(results.platformFee, currency, currencySymbol)],
             ['Total Reward Budget', formatCurrency(results.rewardBudgetTotal, currency, currencySymbol)],
             ['On-Site Training Cost', formatCurrency(results.trainingCost, currency, currencySymbol)],
             ['Admin Setup Cost (Internal)', formatCurrency(results.adminSetupCost, currency, currencySymbol)],
             [{ content: 'Total Implementation Cost', styles: { fontStyle: 'bold'} }, { content: formatCurrency(results.totalImplementationCost, currency, currencySymbol), styles: { fontStyle: 'bold'} }],
         ],
         headStyles: { fillColor: SCRATCHIE_ORANGE, textColor: '#FFFFFF' },
         didDrawPage: (data) => { currentY = data.cursor.y + 5; }
     });
     if (doc.previousAutoTable && doc.previousAutoTable.finalY) currentY = doc.previousAutoTable.finalY + 10;
     
     currentY = _addSectionTitle("Benefits Breakdown Details", currentY);
     currentY = Math.max(currentY, 20);
     doc.autoTable({
         startY: currentY, theme: 'striped',
         head: [['Benefit Category', 'Projected Value', 'Basis of Calculation']],
         body: [
             ['Incident Cost Savings', formatCurrency(results.incidentCostSavings, currency, currencySymbol), results.calc_incidentCostSavings || ''],
             ['Hazard Reporting Efficiency', formatCurrency(results.hazardReportingValue, currency, currencySymbol), results.calc_hazardReportingValue || ''],
             ['Administrative Time Savings', formatCurrency(results.adminTimeSavingsTotal, currency, currencySymbol), results.calc_adminTimeSavingsTotal || ''],
             ['Productivity Gain (1.5%)', formatCurrency(results.productivityGain, currency, currencySymbol), results.calc_productivityGain || ''],
             [{ content: 'Total Projected Benefits', styles: { fontStyle: 'bold'} }, { content: formatCurrency(results.totalBenefits, currency, currencySymbol), styles: { fontStyle: 'bold'} }, ''],
         ],
         columnStyles: { 2: { cellWidth: 'auto',  minCellWidth: 60 } }, // Allow 'Basis of Calculation' to wrap
         headStyles: { fillColor: SCRATCHIE_GREEN, textColor: '#FFFFFF' },
         didDrawPage: (data) => { currentY = data.cursor.y + 5; }
     });
     if (doc.previousAutoTable && doc.previousAutoTable.finalY) currentY = doc.previousAutoTable.finalY + 10;

     currentY = _addSectionTitle("Next Steps", currentY);
     currentY = _addText("This report provides a high-level estimate. For a detailed discussion and tailored proposal, please contact Scratchie.", 14, currentY, { fontSize: 10, maxWidth: pageWidth - 28, spacingAfter: 5 });
     currentY = _addText("James Kell | 0410 133 600 | james@scratchie.com | www.scratchie.com", 14, currentY, { fontSize: 10, color: SCRATCHIE_ORANGE, maxWidth: pageWidth - 28 });
 
     doc.save(`Scratchie_ROI_Summary_${inputs.country}.pdf`);
   };

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8"> {/* Removed Inter font-family, handled by index.css */}
      {/* <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style> */} {/* Removed inline style */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <Header />
        <div className="px-6 pt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 text-right">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="p-6 md:p-8">
            {currentStep === 1 && (
                <RegionIndustrySection
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    setCurrentStep={setCurrentStep}
                    countrySettings={countrySettings}
                    sectors={sectors}
                    industryDefaults={industryDefaults}
                />
            )}

            {currentStep === 2 && (
                <SiteBasicsSection
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    setCurrentStep={setCurrentStep}
                    currencySymbol={currencySymbol}
                />
            )}

            {currentStep === 3 && (
                <SafetyProgramSection
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    setCurrentStep={setCurrentStep}
                    trirUnit={trirUnit}
                    currencySymbol={currencySymbol}
                />
            )}

            {currentStep === 4 && (
                <EfficiencyImpactSection
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    setCurrentStep={setCurrentStep}
                    currencySymbol={currencySymbol}
                />
            )}

            {currentStep === 5 && (
                <ROISummarySection
                    results={results}
                    inputs={inputs}
                    currency={currency}
                    currencySymbol={currencySymbol}
                    trirUnit={trirUnit}
                    getRoiRating={getRoiRating}
                    formatCurrency={formatCurrency}
                    formatCurrencyNoCents={formatCurrencyNoCents}
                    formatNumber={formatNumber}
                    calculateSensitivityRoi={calculateSensitivityRoi}
                    sensitivityScenarios={sensitivityScenarios}
                    setCurrentStep={setCurrentStep}
                    generatePDF={generatePDF}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default ScratchieROICalculator;