// server/controllers/trackerController.js
import Tracker from '../models/Tracker.js';

export const createTracker = async (req, res) => {
  try {
    const { name, isDefinedPeriod, targetDays, startDate } = req.body;
    
    const trackerData = { 
      name, 
      userId: req.auth.userId,
      isDefinedPeriod: isDefinedPeriod || false,
      targetDays: targetDays || 0
    };
    
    // If this is a defined period tracker, set start and end dates
    if (isDefinedPeriod && targetDays > 0) {
      trackerData.startDate = startDate || new Date();
      
      // Calculate end date based on targetDays
      const endDate = new Date(trackerData.startDate);
      endDate.setDate(endDate.getDate() + targetDays - 1); // -1 because the start day counts as day 1
      trackerData.endDate = endDate;
    }
    
    const tracker = await Tracker.create(trackerData);
    res.status(201).json(tracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrackers = async (req, res) => {
  try {
    const trackers = await Tracker.find({ userId: req.auth.userId });
    
    // Add additional information for each tracker
    const trackersWithInfo = trackers.map(tracker => {
      const trackerObj = tracker.toObject();
      
      // Calculate remaining days for defined period trackers
      if (tracker.isDefinedPeriod && tracker.endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const endDate = new Date(tracker.endDate);
        endDate.setHours(0, 0, 0, 0);
        
        // Calculate days remaining (including today)
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        trackerObj.daysRemaining = Math.max(0, daysRemaining);
        
        // Calculate completion percentage
        if (tracker.targetDays > 0) {
          trackerObj.completionPercentage = Math.min(100, Math.round((tracker.markedDays.length / tracker.targetDays) * 100));
        }
      }
      
      return trackerObj;
    });
    
    res.status(200).json(trackersWithInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markDay = async (req, res) => {
  try {
    const tracker = await Tracker.findOne({ _id: req.params.id, userId: req.auth.userId });
    if (!tracker) return res.status(404).json({ message: 'Tracker not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for consistent date comparison
    
    // Check if already marked for today
    const alreadyMarked = tracker.markedDays.some(date => {
      const markedDate = new Date(date);
      markedDate.setHours(0, 0, 0, 0);
      return markedDate.getTime() === today.getTime();
    });
    
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Already marked for today' });
    }

    // For defined period trackers, check if we're within the valid period
    if (tracker.isDefinedPeriod) {
      if (tracker.endDate) {
        const endDate = new Date(tracker.endDate);
        endDate.setHours(23, 59, 59, 999); // End of the day
        
        if (today > endDate) {
          return res.status(400).json({ message: 'This tracker has completed its defined period' });
        }
      }
      
      if (tracker.startDate) {
        const startDate = new Date(tracker.startDate);
        startDate.setHours(0, 0, 0, 0); // Start of the day
        
        if (today < startDate) {
          return res.status(400).json({ message: 'This tracker has not yet started its defined period' });
        }
      }
    }

    tracker.markedDays.push(today);
    await tracker.save();

    // Add remaining days info for the response
    const trackerObj = tracker.toObject();
    if (tracker.isDefinedPeriod && tracker.endDate) {
      const endDate = new Date(tracker.endDate);
      endDate.setHours(0, 0, 0, 0);
      
      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      trackerObj.daysRemaining = Math.max(0, daysRemaining);
      
      // Calculate completion percentage
      if (tracker.targetDays > 0) {
        trackerObj.completionPercentage = Math.min(100, Math.round((tracker.markedDays.length / tracker.targetDays) * 100));
      }
    }

    res.status(200).json(trackerObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTracker = async (req, res) => {
  try {
    const tracker = await Tracker.findOneAndDelete({ _id: req.params.id, userId: req.auth.userId });
    if (!tracker) return res.status(404).json({ message: 'Tracker not found' });

    res.status(200).json({ message: 'Tracker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
