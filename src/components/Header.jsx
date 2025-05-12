import React from 'react';
import logo from '../assets/scratchie-logo.png';

const SCRATCHIE_ORANGE = '#F97115';

const Header = () => (
  <header className="p-6 bg-gray-800 text-white flex flex-col md:flex-row justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{color: SCRATCHIE_ORANGE}}>Scratchie ROI Calculator</h1>
      <p className="text-gray-300 text-sm">Build your business case for safety and engagement.</p>
    </div>
    <img src={logo} alt="Scratchie Logo" className="h-10 md:h-12 mt-3 md:mt-0" />
  </header>
);

export default Header; 