import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import suggestionRoutes from '../src/routes/suggestionRoutes.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import User from '../src/models/User.js';
import Suggestion from '../src/models/Suggestion.js';
import jwt from 'jsonwebtoken';
import { toggleUpvote } from '../src/controllers/upvoteController.js';
import { authenticate } from '../src/middlewares/auth.js';
import { upvoteLimiter } from '../src/middlewares/rateLimiter.js';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.post('/api/suggestions/:id/upvote', authenticate, upvoteLimiter, toggleUpvote);
app.use('/api/suggestions', suggestionRoutes);
app.use(errorHandler);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '30d' });
};

describe('Upvote API', () => {
  let authToken;
  let userId;
  let suggestionId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/suggestify_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Suggestion.deleteMany({});

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    userId = user._id;
    authToken = generateToken(user._id);

    const suggestion = await Suggestion.create({
      title: 'Test Suggestion',
      description: 'Test Description',
      author: userId,
      upvotesCount: 0,
      upvoters: []
    });

    suggestionId = suggestion._id;
  });

  describe('POST /api/suggestions/:id/upvote', () => {
    it('should add upvote', async () => {
      const res = await request(app)
        .post(`/api/suggestions/${suggestionId}/upvote`)
        .set('Cookie', `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.upvoted).toBe(true);
      expect(res.body.upvotesCount).toBe(1);

      const updated = await Suggestion.findById(suggestionId);
      expect(updated.upvotesCount).toBe(1);
      expect(updated.upvoters.length).toBe(1);
    });

    it('should toggle upvote off', async () => {
      // First upvote
      await request(app)
        .post(`/api/suggestions/${suggestionId}/upvote`)
        .set('Cookie', `token=${authToken}`);

      // Remove upvote
      const res = await request(app)
        .post(`/api/suggestions/${suggestionId}/upvote`)
        .set('Cookie', `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.upvoted).toBe(false);
      expect(res.body.upvotesCount).toBe(0);

      const updated = await Suggestion.findById(suggestionId);
      expect(updated.upvotesCount).toBe(0);
      expect(updated.upvoters.length).toBe(0);
    });
  });
});

