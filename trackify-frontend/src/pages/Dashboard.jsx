import React, { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import API from '../api';
import TrackerCard from '../components/TrackerCard';
import TrackerForm from '../components/TrackerForm';

const Dashboard = () => {
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTrackers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/trackers');
      setTrackers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trackers:', err);
      setError('Failed to load your trackers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTracker = async (trackerData) => {
    try {
      await API.post('/trackers', trackerData);
      fetchTrackers();
      setShowAddForm(false); // Hide the form after successful creation
    } catch (err) {
      console.error('Error creating tracker:', err);
      setError('Failed to create tracker. Please try again.');
    }
  };

  const markDay = async (id) => {
    try {
      await API.patch(`/trackers/${id}/mark`);
      fetchTrackers();
    } catch (err) {
      console.error('Error marking day:', err);
      setError('Failed to mark day. Please try again.');
    }
  };

  const deleteTracker = async (id) => {
    try {
      await API.delete(`/trackers/${id}`);
      fetchTrackers();
    } catch (err) {
      console.error('Error deleting tracker:', err);
      setError('Failed to delete tracker. Please try again.');
    }
  };

  useEffect(() => {
    fetchTrackers();
  }, []);

  // Calculate overall stats
  const totalDaysTracked = trackers.reduce((sum, tracker) => sum + tracker.markedDays.length, 0);
  const activeStreaks = trackers.filter(tracker => tracker.streak > 0).length;
  const highestStreak = trackers.length > 0 ? Math.max(...trackers.map(tracker => tracker.streak)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 group">
                <svg className="h-6 w-6 text-white group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight hover:from-purple-600 hover:to-indigo-600 transition-all duration-500">Trackify</h1>
                <p className="text-xs text-gray-500 font-medium">Build habits that last</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-200"></div>
                <div className="relative bg-white rounded-full p-0.5">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      {!loading && trackers.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-bold">Your Progress Overview</h2>
              <div className="ml-auto flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors duration-200 cursor-pointer group">
                <span className="text-sm font-medium">This Month</span>
                <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-indigo-200">Total Days Tracked</div>
                    <div className="text-3xl font-bold mt-1">{totalDaysTracked}</div>
                    <div className="text-xs text-indigo-200 mt-1">across all your habits</div>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-indigo-200">Active Streaks</div>
                    <div className="text-3xl font-bold mt-1">{activeStreaks}</div>
                    <div className="text-xs text-indigo-200 mt-1">habits with ongoing streaks</div>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-indigo-200">Highest Streak</div>
                    <div className="text-3xl font-bold mt-1">{highestStreak}</div>
                    <div className="text-xs text-indigo-200 mt-1">days in your best habit</div>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Add New Tracker Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add New Tracker
            </h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-all duration-200 font-medium"
            >
              {showAddForm ? 'Hide Form' : 'Show Form'}
              <svg className={`w-4 h-4 transition-transform duration-200 ${showAddForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showAddForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
              <TrackerForm onCreate={createTracker} />
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative animate-fadeIn flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                  <button 
                    onClick={() => setError(null)} 
                    className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Dismiss"
                  >
                    <span className="text-xl">&times;</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {!showAddForm && !loading && trackers.length === 0 && (
            <div className="bg-white shadow-lg rounded-2xl p-16 text-center border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">No trackers yet</h3>
              <p className="text-gray-500 max-w-md mx-auto text-lg">
                Get started by creating a tracker. You can track habits, workouts, or any daily activity you want to maintain.
              </p>
              <div className="mt-8">
                <button 
                  onClick={() => setShowAddForm(true)} 
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Create Your First Tracker
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-ping rounded-full bg-indigo-600 opacity-50"></div>
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading your trackers...</p>
          </div>
        ) : trackers.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Your Trackers
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full">
                  <span className="font-medium text-indigo-700">{trackers.length}</span>
                  <span className="ml-1">tracker{trackers.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'} rounded-l-lg transition-colors duration-150`}
                    title="Grid View"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'} rounded-r-lg transition-colors duration-150`}
                    title="List View"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={viewMode === 'grid' ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {trackers.map((tracker) => (
                <div key={tracker._id} className={`${viewMode === 'list' ? 'animate-fadeIn' : 'animate-fadeIn'} transition-transform duration-300 hover:scale-[1.02]`}>
                  <TrackerCard
                    tracker={tracker}
                    onMark={markDay}
                    onDelete={deleteTracker}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 group">
                <svg className="h-5 w-5 text-white group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Trackify</span>
            </div>
            
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Trackify App. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://github.com/Himanshu-Saraswat-01122004" className="text-gray-400 hover:text-indigo-500 transition duration-300 transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500">Trackify helps you build better habits through consistent daily tracking.</p>
            <p className="text-gray-500 mt-2">Made with <span className="text-red-500">❤️</span> by yogi</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.013-1.703z" />
                </svg>
                <span>Terms</span>
              </a>
              <a href="#" className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Privacy</span>
              </a>
              <a href="#" className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
