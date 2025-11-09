import express from 'express';
import { getTopSuggestions, getStatusCounts } from '../controllers/statsController.js';

const router = express.Router();

router.get('/top', getTopSuggestions);
router.get('/status-counts', getStatusCounts);

export default router;

