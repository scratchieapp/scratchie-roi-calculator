import React from 'react';
import SectionCard from './SectionCard';

const ROISummarySection = ({ results, inputs, currency, currencySymbol, trirUnit, getRoiRating, formatCurrency, formatCurrencyNoCents, formatNumber, calculateSensitivityRoi, sensitivityScenarios, setCurrentStep, generatePDF }) => (
    <>
        <section className="mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 md:p-8 rounded-lg shadow-xl text-white">
                <h2 className="text-3xl font-bold mb-6 text-center">Your ROI Summary</h2>
                <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                    <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <path className="text-orange-300" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.8" />
                                <path className="text-white" strokeDasharray={`${results.roi === Infinity ? 100 : Math.min(Math.max(results.roi,0), 300) / 300 * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.8" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{results.roi === Infinity ? "∞" : formatNumber(results.roi, 0)}%</span>
                                <span className="text-sm">ROI</span>
                            </div>
                        </div>
                        <div className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold ${getRoiRating(results.roi).className}`}>
                           {getRoiRating(results.roi).text}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-center md:text-left">
                        <div><p className="text-sm text-orange-200">Total Investment</p><p className="text-2xl font-bold">{formatCurrencyNoCents(results.totalImplementationCost, currency, currencySymbol)}</p></div>
                        <div><p className="text-sm text-orange-200">Total Benefits</p><p className="text-2xl font-bold">{formatCurrencyNoCents(results.totalBenefits, currency, currencySymbol)}</p></div>
                        <div><p className="text-sm text-orange-200">Net Benefit</p><p className="text-2xl font-bold">{formatCurrencyNoCents(results.netBenefit, currency, currencySymbol)}</p></div>
                        <div><p className="text-sm text-orange-200">Payback Period</p><p className="text-2xl font-bold">{results.paybackPeriod === Infinity ? "N/A" : formatNumber(results.paybackPeriod, 1)} <span className="text-lg">months</span></p></div>
                    </div>
                </div>
            </div>
        </section>

        <SectionCard title="Implementation Costs Breakdown" color="orange" className="mb-6">
            <table className="min-w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                    {[['Platform Fee', results.platformFee], ['Total Reward Budget', results.rewardBudgetTotal], ['On-Site Training Cost', results.trainingCost], ['Admin Setup Cost (Internal)', results.adminSetupCost]].map(([label, value]) => (
                        <tr key={label}><td className="py-2 pr-2">{label}</td><td className="py-2 text-right font-medium">{formatCurrency(value, currency, currencySymbol)}</td></tr>
                    ))}
                    <tr className="font-bold bg-orange-50"><td className="py-2 pr-2">Total Implementation Cost</td><td className="py-2 text-right">{formatCurrency(results.totalImplementationCost, currency, currencySymbol)}</td></tr>
                </tbody>
            </table>
        </SectionCard>

        <SectionCard title="Benefits Breakdown (Over Calculation Period)" color="green" className="mb-6">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="py-2 px-2 text-left font-semibold">Benefit Category</th><th className="py-2 px-2 text-right font-semibold">Value</th><th className="py-2 px-2 text-left font-semibold">Calculation Basis</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                    <tr><td className="py-2 pr-2">Incident Cost Savings</td><td className="py-2 text-right font-medium">{formatCurrency(results.incidentCostSavings, currency, currencySymbol)}</td><td className="py-2 pl-2 text-xs text-gray-500">{results.calc_incidentCostSavings}</td></tr>
                    <tr><td className="py-2 pr-2">Hazard Reporting Efficiency</td><td className="py-2 text-right font-medium">{formatCurrency(results.hazardReportingValue, currency, currencySymbol)}</td><td className="py-2 pl-2 text-xs text-gray-500">{results.calc_hazardReportingValue}</td></tr>
                    <tr><td className="py-2 pr-2">Administrative Time Savings</td><td className="py-2 text-right font-medium">{formatCurrency(results.adminTimeSavingsTotal, currency, currencySymbol)}</td><td className="py-2 pl-2 text-xs text-gray-500">{results.calc_adminTimeSavingsTotal}</td></tr>
                    <tr><td className="py-2 pr-2">Productivity Gain (1.5%)</td><td className="py-2 text-right font-medium">{formatCurrency(results.productivityGain, currency, currencySymbol)}</td><td className="py-2 pl-2 text-xs text-gray-500">{results.calc_productivityGain}</td></tr>
                    <tr className="font-bold bg-green-50"><td className="py-2 pr-2">Total Projected Benefits</td><td className="py-2 text-right">{formatCurrency(results.totalBenefits, currency, currencySymbol)}</td><td></td></tr>
                </tbody>
            </table>
        </SectionCard>
        
        <SectionCard title="Tracking Success: Key Metrics & Benchmarking" color="blue" className="mb-6">
            <p className="text-sm text-gray-700">To measure the impact of Scratchie over time, consider tracking these key metrics:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                <li>Lagging Indicators: Incident rates (TRIR, LTIER), workers' compensation costs.</li>
                <li>Leading Indicators: Hazard reporting frequency, near-miss reports, safety observations, training completion rates, employee engagement scores (via surveys).</li>
                <li>Operational Metrics: Time to hazard resolution, inspection pass rates, productivity measures.</li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">Regularly benchmark these against your initial data and industry averages to demonstrate continuous improvement.</p>
        </SectionCard>

        <SectionCard title="Self-Determination Theory (SDT) & Additional Benefits" color="purple" className="mb-6">
            <p className="text-sm text-gray-700">Scratchie fosters Autonomy, Competence, and Relatedness, driving intrinsic safety motivation. Expect qualitative benefits like improved morale, team cohesion, and enhanced company reputation.</p>
        </SectionCard>

        <SectionCard title="Sensitivity Analysis" color="gray" className="mb-6">
            <p className="text-sm text-gray-600 mb-3">ROI based on varying incident reduction rates:</p>
             <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="py-2 px-2 text-left font-semibold">Scenario</th><th className="py-2 px-2 text-center font-semibold">Incident Reduction</th><th className="py-2 px-2 text-right font-semibold">Projected ROI</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sensitivityScenarios.map(s => {
                        const roi = calculateSensitivityRoi(s.reduction);
                        return (<tr key={s.name} className={s.name === 'Expected' ? 'bg-blue-50 font-medium' : ''}>
                            <td className="py-2 pr-2">{s.name}</td><td className="py-2 text-center">{formatNumber(s.reduction,0)}%</td>
                            <td className={`py-2 text-right ${roi < 0 ? 'text-red-600' : (roi === Infinity ? 'text-green-700 font-bold' : 'text-green-600')}`}>{roi === Infinity ? "Infinite" : `${formatNumber(roi,0)}%`}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </SectionCard>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <button onClick={() => setCurrentStep(4)} className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg w-full sm:w-auto">Back to Inputs</button>
            <button onClick={generatePDF} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 flex items-center justify-center w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>
                Download PDF Summary
            </button>
        </div>
         <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Ready to discuss further?</p>
            <a href="mailto:james@scratchie.com?subject=Enquiry%20from%20Scratchie%20ROI%20Calculator" className="text-orange-500 hover:text-orange-700 font-semibold">james@scratchie.com</a>
            <p className="text-xs text-gray-500 mt-1">james@scratchie.com | 0410 133 600</p>
        </div>
    </>
);

export default ROISummarySection; 