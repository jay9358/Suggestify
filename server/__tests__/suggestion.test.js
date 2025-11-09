import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import suggestionRoutes from '../src/routes/suggestionRoutes.js';
import { authenticate } from '../src/middlewares/auth.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import User from '../src/models/User.js';
import Suggestion from '../src/models/Suggestion.js';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/api/suggestions', suggestionRoutes);
app.use(errorHandler);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '30d' });
};

describe('Suggestion API', () => {
  let authToken;
  let userId;

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
  });

  describe('POST /api/suggestions', () => {
    it('should create a suggestion', async () => {
      const res = await request(app)
        .post('/api/suggestions')
        .set('Cookie', `token=${authToken}`)
        .send({
          title: 'Test Suggestion',
          description: 'This is a test suggestion',
          tags: ['test', 'feature']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.suggestion.title).toBe('Test Suggestion');
      expect(res.body.suggestion.author._id.toString()).toBe(userId.toString());
    });

    it('should not create suggestion without auth', async () => {
      const res = await request(app)
        .post('/api/suggestions')
        .send({
          title: 'Test Suggestion',
          description: 'This is a test suggestion'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/suggestions', () => {
    beforeEach(async () => {
      await Suggestion.create({
        title: 'Suggestion 1',
        description: 'Description 1',
        author: userId,
        status: 'New'
      });

      await Suggestion.create({
        title: 'Suggestion 2',
        description: 'Description 2',
        author: userId,
        status: 'Approved'
      });
    });

    it('should get all suggestions', async () => {
      const res = await request(app)
        .get('/api/suggestions');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.suggestions.length).toBe(2);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/suggestions?status=New');

      expect(res.statusCode).toBe(200);
      expect(res.body.suggestions.length).toBe(1);
      expect(res.body.suggestions[0].status).toBe('New');
    });
  });
});

