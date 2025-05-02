import React, { useState, useRef, useEffect } from 'react';

const TrackerForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefinedPeriod, setIsDefinedPeriod] = useState(false);
  const [targetDays, setTargetDays] = useState(30);
  const [showSelect, setShowSelect] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const customInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Add the defined period options if user has enabled it
      const trackerData = {
        name: name.trim(),
        isDefinedPeriod,
        targetDays: isDefinedPeriod ? targetDays : 0,
        startDate: isDefinedPeriod ? startDate : null
      };
      
      await onCreate(trackerData);
      setName('');
      // Reset form if submission successful
      setIsDefinedPeriod(false);
      setTargetDays(30);
      setShowSelect(true);
      setStartDate(new Date().toISOString().split('T')[0]);
      setShowAdvanced(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowSelect(false);
      setTimeout(() => {
        if (customInputRef.current) {
          customInputRef.current.focus();
        }
      }, 10);
    } else {
      setTargetDays(Number(value));
    }
  };

  const handleCustomDaysChange = (e) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setTargetDays(value === '' ? '' : Number(value));
    }
  };

  const handleCustomDaysBlur = () => {
    if (targetDays === '' || isNaN(targetDays)) {
      setTargetDays(30);
      setShowSelect(true);
    }
  };
  
  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      customInputRef.current.blur();
    } else if (e.key === 'Escape') {
      setTargetDays(30);
      setShowSelect(true);
    }
  };

  // Common style classes for improved consistency with color enhancements
  const inputClass = "border border-indigo-200 text-gray-800 rounded-md px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white shadow-sm hover:border-indigo-300";
  const labelClass = "block text-sm font-medium text-indigo-700 mb-1.5";
  const selectClass = "border border-indigo-200 rounded-md px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm hover:border-indigo-300 text-gray-800";
  
  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-lg p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Tracker Name Field */}
          <div className="md:col-span-3">
            <label htmlFor="tracker-name" className={labelClass}>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Tracker Name
              </span>
            </label>
            <input
              id="tracker-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Exercise, Reading, Meditation, etc."
              className={inputClass}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-2.5 rounded-md transition duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={!name.trim() || isSubmitting || (targetDays === '')}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Tracker
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Toggle for Advanced Options */}
        <div className="flex justify-center border-t border-indigo-100 pt-4">
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-sm font-medium flex items-center px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm ${showAdvanced ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'}`}
          >
            {showAdvanced ? (
              <>
                <svg className="h-5 w-5 mr-1.5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>Hide Advanced Options</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Show Advanced Options</span>
              </>
            )}
          </button>
        </div>
        
        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 p-5 rounded-md border border-indigo-100 animate-fadeIn shadow-inner">
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isDefinedPeriod} 
                    onChange={() => setIsDefinedPeriod(!isDefinedPeriod)}
                    className="sr-only" 
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${isDefinedPeriod ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isDefinedPeriod ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-3 text-sm font-semibold text-indigo-800">Track for a defined period</span>
              </label>
              <p className="text-xs text-indigo-600 mt-1 ml-14">Set a specific number of days to track this habit</p>
            </div>
            
            {isDefinedPeriod && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-md border border-indigo-100 shadow-sm">
                <div>
                  <label htmlFor="target-days" className={labelClass}>Number of Days</label>
                  <div className="relative">
                    {showSelect ? (
                      <>
                        <select
                          id="target-days"
                          value={targetDays}
                          onChange={handleDaysChange}
                          className={selectClass}
                        >
                          <option value="7">7 days (1 week)</option>
                          <option value="14">14 days (2 weeks)</option>
                          <option value="21">21 days (3 weeks)</option>
                          <option value="30">30 days (1 month)</option>
                          <option value="60">60 days (2 months)</option>
                          <option value="90">90 days (3 months)</option>
                          <option value="180">180 days (6 months)</option>
                          <option value="365">365 days (1 year)</option>
                          <option value="custom">Custom number of days...</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="relative">
                        <input
                          ref={customInputRef}
                          id="custom-days-input"
                          type="text"
                          value={targetDays}
                          onChange={handleCustomDaysChange}
                          onBlur={handleCustomDaysBlur}
                          onKeyDown={handleCustomKeyDown}
                          placeholder="Enter number of days"
                          className={inputClass + " pr-10"}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowSelect(true)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500 hover:text-indigo-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="start-date" className={labelClass}>Start Date</label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                
                <div className="md:col-span-2 mt-2 p-3 bg-purple-50 rounded-md border border-purple-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">About Defined Period Tracking</h3>
                      <div className="text-xs text-purple-600 mt-1">
                        <p>When you set a defined period, Trackify will show your progress toward completing the goal and track streaks within that timeframe.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default TrackerForm;
