// server/routes/trackerRoutes.js
import express from 'express';
import { createTracker, getTrackers, markDay, deleteTracker } from '../controllers/trackerController.js';
import requireAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createTracker);
router.get('/', requireAuth, getTrackers);
router.patch('/:id/mark', requireAuth, markDay);
router.delete('/:id', requireAuth, deleteTracker);

export default router;
