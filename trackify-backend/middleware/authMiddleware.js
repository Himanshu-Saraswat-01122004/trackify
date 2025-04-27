// server/middleware/authMiddleware.js
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Create a simple middleware that checks for authentication
const requireAuth = (req, res, next) => {
  // req.auth is populated by the Clerk middleware in server.js
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  
  // User is authenticated, proceed
  next();
};

export default requireAuth;
