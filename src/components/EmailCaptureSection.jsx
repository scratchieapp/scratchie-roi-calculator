import React, { useState } from 'react';
import SectionCard from './SectionCard';

const EmailCaptureSection = ({ 
  setCurrentStep, 
  onEmailSubmit, 
  isSubmitting = false 
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError && value) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }
    
    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      await onEmailSubmit(email.trim());
    } catch (error) {
      setEmailError('Something went wrong. Please try again.');
    }
  };

  return (
    <SectionCard title="Get Your ROI Summary" color="orange" icon="📧">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          You're almost done! 🎉
        </h3>
        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
          Enter your email address to receive your personalized ROI business case summary. 
          We'll send you a detailed PDF report that you can share with your team.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-orange-800 mb-4">
              What you'll receive:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-orange-700">
              <div className="flex items-center justify-center sm:justify-start">
                <svg className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Detailed PDF business case summary</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <svg className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>All your inputs and calculated results</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <svg className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Professional report for stakeholders</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <svg className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Follow-up from our team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150 ${
              emailError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your.email@company.com"
            disabled={isSubmitting}
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600 text-center">{emailError}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-xs text-gray-600">
                <strong>Privacy Notice:</strong> We respect your privacy. Your email will only be used to send you the ROI summary and occasional updates about Scratchie. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center pt-4 gap-4">
          <button 
            type="button"
            onClick={() => setCurrentStep(4)} 
            className="text-gray-600 hover:text-orange-500 font-medium py-2 px-4 rounded-lg transition duration-150"
            disabled={isSubmitting}
          >
            Back
          </button>
          
          <button 
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Get My ROI Summary
              </>
            )}
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

export default EmailCaptureSection; 