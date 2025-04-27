// server/models/Tracker.js
import mongoose from 'mongoose';

const trackerSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  name: { type: String, required: true },
  markedDays: [{ type: Date }],
  createdAt: { type: Date, default: Date.now },
  // New fields for defined days tracking
  isDefinedPeriod: { type: Boolean, default: false },
  targetDays: { type: Number, default: 0 }, // Number of days to track (e.g., 30, 60, 90)
  startDate: { type: Date }, // When the defined period starts
  endDate: { type: Date }, // When the defined period should end
  // Additional fields for analytics
  streak: { type: Number, default: 0 }, // Current streak
  longestStreak: { type: Number, default: 0 }, // Longest streak achieved
});

// Pre-save hook to calculate streak
trackerSchema.pre('save', function(next) {
  // Skip if no marked days
  if (!this.markedDays || this.markedDays.length === 0) {
    this.streak = 0;
    return next();
  }

  // Sort days in ascending order
  const sortedDays = [...this.markedDays].sort((a, b) => new Date(a) - new Date(b));
  
  // Get today and yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if most recent day is today or yesterday
  const mostRecentDay = new Date(sortedDays[sortedDays.length - 1]);
  mostRecentDay.setHours(0, 0, 0, 0);
  
  // If the most recent day is not today or yesterday, streak is broken
  if (mostRecentDay.getTime() !== today.getTime() && 
      mostRecentDay.getTime() !== yesterday.getTime()) {
    this.streak = 0;
    return next();
  }
  
  // Initialize streak with the most recent day
  let streak = 1;
  let currentDate = mostRecentDay;
  
  // Count streak by walking backward through the sorted days
  for (let i = sortedDays.length - 2; i >= 0; i--) {
    const prevDay = new Date(sortedDays[i]);
    prevDay.setHours(0, 0, 0, 0);
    
    // If the previous day is exactly one day before the current date, increment streak
    const expectedPrevDay = new Date(currentDate);
    expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
    
    if (prevDay.getTime() === expectedPrevDay.getTime()) {
      streak++;
      currentDate = prevDay;
    } else {
      break; // Streak is broken
    }
  }
  
  // Update streak and potentially longestStreak
  this.streak = streak;
  if (streak > this.longestStreak) {
    this.longestStreak = streak;
  }
  
  next();
});

const Tracker = mongoose.model('Tracker', trackerSchema);

export default Tracker;
