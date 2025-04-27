import React, { useState } from 'react';

const TrackerCard = ({ tracker, onMark, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const isMarkedToday = tracker.markedDays.some(date => {
    const markedDate = new Date(date);
    const todayDate = new Date(today);
    return (
      markedDate.getFullYear() === todayDate.getFullYear() &&
      markedDate.getMonth() === todayDate.getMonth() &&
      markedDate.getDate() === todayDate.getDate()
    );
  });

  // Calculate days in current month for the calendar
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  // Create array of days for current month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    // Check if this date is marked by comparing with all marked days
    const isMarked = tracker.markedDays.some(markedDate => {
      // Convert both to same format for comparison
      const markedDateObj = new Date(markedDate);
      return (
        markedDateObj.getFullYear() === date.getFullYear() &&
        markedDateObj.getMonth() === date.getMonth() &&
        markedDateObj.getDate() === date.getDate()
      );
    });
    
    return {
      day,
      date: dateString,
      isMarked
    };
  });

  const handleMark = async () => {
    if (isLoading || isMarkedToday) return;
    setIsLoading(true);
    try {
      await onMark(tracker._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(tracker._id);
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  // Format streak with appropriate suffix
  const formatStreak = (streak) => {
    if (streak === 1) return '1 day';
    return `${streak} days`;
  };

  // Format dates to display in user friendly format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate completion percentage for progress bar
  const completionPercentage = tracker.completionPercentage || 
    (tracker.isDefinedPeriod && tracker.targetDays ? 
      Math.min(100, Math.round((tracker.markedDays.length / tracker.targetDays) * 100)) : 0);

  // Set streak color based on current streak length
  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 20) return 'text-indigo-600';
    if (streak >= 10) return 'text-blue-600';
    if (streak >= 5) return 'text-green-600';
    return 'text-orange-500';
  };

  // Generate streak badge message
  const getStreakBadge = (streak) => {
    if (streak >= 30) return 'Amazing!';
    if (streak >= 20) return 'Excellent!';
    if (streak >= 10) return 'Great Job!';
    if (streak >= 5) return 'Good Progress!';
    if (streak >= 1) return 'Keep Going!';
    return 'Start Today!';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-150 ease-in-out flex flex-col h-full">
      {/* Card Header with gradient background based on streak */}
      <div className={`p-4 border-b border-gray-200 ${getHeaderGradient(tracker.streak)}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{tracker.name}</h2>
          <div className="rounded-full bg-white bg-opacity-90 px-3 py-1 text-sm font-medium text-blue-800 shadow-sm ml-2 whitespace-nowrap">
            {formatStreak(tracker.streak)}
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="p-4 grid grid-cols-2 gap-4 bg-white">
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Total Days</p>
          <p className="text-2xl font-bold text-gray-700">{tracker.markedDays.length}</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Current Streak</p>
          <div className="flex items-center">
            <p className={`text-2xl font-bold ${getStreakColor(tracker.streak)}`}>{tracker.streak}</p>
            <svg className={`ml-1 h-5 w-5 ${getStreakColor(tracker.streak)}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Defined Period Info or Streak Stats for non-defined */}
      <div className="px-4 pt-2 pb-4 flex-grow">
        {tracker.isDefinedPeriod ? (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 h-full">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-blue-800">
                {tracker.daysRemaining > 0 ? 
                  `${tracker.daysRemaining} days remaining` : 
                  'Challenge completed!'}
              </p>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {completionPercentage}% complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-500">Started: </span>
                {tracker.startDate ? formatDate(tracker.startDate) : 'N/A'}
              </div>
              <div>
                <span className="text-gray-500">End: </span>
                {tracker.endDate ? formatDate(tracker.endDate) : 'N/A'}
              </div>
            </div>
          </div>
        ) : (
          /* Streak info for non-defined period trackers */
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-lg p-3 h-full">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className={`mb-2 px-3 py-1 rounded-full ${getStreakBadgeColor(tracker.streak)}`}>
                <span className="text-xs font-semibold">{getStreakBadge(tracker.streak)}</span>
              </div>
              <div className="flex items-center justify-center mb-1">
                <p className="text-sm font-medium text-gray-600">Longest Streak: </p>
                <p className="ml-1 text-sm font-bold text-indigo-700">{tracker.longestStreak || tracker.streak} days</p>
              </div>
              <p className="text-xs text-gray-500">Track consistently to build your streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Mini-View */}
      <div className="px-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold text-gray-700">This Month</p>
          <p className="text-xs text-gray-500">{new Date().toLocaleString('default', { month: 'long' })}</p>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {daysArray.map((day) => (
            <div
              key={day.date}
              className={`h-7 w-7 flex items-center justify-center text-xs rounded-full cursor-default ${day.isMarked
                ? 'bg-green-600 text-white font-bold shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-150'
              }`}
              title={day.date}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
        {showConfirmation ? (
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-700 mb-2">Are you sure you want to delete this tracker?</p>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex-1 flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Confirm Delete'}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium flex-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleMark}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${isMarkedToday
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm'
              }`}
              disabled={isLoading || isMarkedToday}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Marking...
                </>
              ) : isMarkedToday ? (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Marked Today
                </>
              ) : 'Mark Today'}
            </button>
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get gradient based on streak
function getHeaderGradient(streak) {
  if (streak >= 50) return 'bg-gradient-to-r from-purple-50 to-purple-100';
  if (streak >= 30) return 'bg-gradient-to-r from-indigo-50 to-indigo-100';
  if (streak >= 20) return 'bg-gradient-to-r from-blue-50 to-blue-100';
  if (streak >= 10) return 'bg-gradient-to-r from-green-50 to-green-100';
  if (streak >= 5) return 'bg-gradient-to-r from-yellow-50 to-yellow-100';
  return 'bg-gradient-to-r from-blue-50 to-indigo-50';
}

// Helper function to get badge color based on streak
function getStreakBadgeColor(streak) {
  if (streak >= 30) return 'bg-purple-100 text-purple-800';
  if (streak >= 20) return 'bg-indigo-100 text-indigo-800';
  if (streak >= 10) return 'bg-blue-100 text-blue-800';
  if (streak >= 5) return 'bg-green-100 text-green-800';
  if (streak >= 1) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
}

export default TrackerCard;
