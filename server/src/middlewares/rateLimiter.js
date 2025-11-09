import rateLimit from 'express-rate-limit';

export const createSuggestionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many suggestions created, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const upvoteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 upvotes per minute
  message: {
    success: false,
    message: 'Too many upvote requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

