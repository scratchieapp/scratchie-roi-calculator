import React from 'react';
import logo from '../assets/scratchie-logo.png';

const SCRATCHIE_ORANGE = '#F97115';

const Header = () => (
  <header className="p-6 bg-gray-800 text-white flex flex-col md:flex-row justify-between items-center">
    <div className="cursor-pointer" onClick={() => window.location.href = window.location.origin}>
      <h1 className="text-3xl font-bold mb-1 hover:opacity-80 transition-opacity" style={{color: SCRATCHIE_ORANGE}}>Scratchie ROI Calculator</h1>
      <p className="text-gray-300 text-sm hover:text-white transition-colors">Build your business case for safety and engagement.</p>
    </div>
    <a href="https://scratchie.com" target="_blank" rel="noopener noreferrer" className="mt-3 md:mt-0">
      <img src={logo} alt="Scratchie Logo" className="h-10 md:h-12 hover:opacity-80 transition-opacity cursor-pointer" />
    </a>
  </header>
);

export default Header; 