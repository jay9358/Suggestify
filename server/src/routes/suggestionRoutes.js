import express from 'express';
import {
  createSuggestion,
  getSuggestions,
  getSuggestion,
  updateSuggestion,
  deleteSuggestion,
  updateStatus
} from '../controllers/suggestionController.js';
import { toggleUpvote } from '../controllers/upvoteController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roles.js';
import { suggestionValidator, statusUpdateValidator } from '../utils/validators.js';
import { createSuggestionLimiter, upvoteLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/', getSuggestions);
router.get('/:id', getSuggestion);

router.use(authenticate);

router.post('/', createSuggestionLimiter, suggestionValidator, createSuggestion);
router.post('/:id/upvote', upvoteLimiter, toggleUpvote);
router.patch('/:id', suggestionValidator, updateSuggestion);
router.delete('/:id', deleteSuggestion);
router.patch('/:id/status', authorize('manager', 'admin'), statusUpdateValidator, updateStatus);

export default router;

