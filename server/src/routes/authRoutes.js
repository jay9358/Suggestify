import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { registerValidator, loginValidator } from '../utils/validators.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;

