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

describe('Status Update API', () => {
  let managerToken;
  let employeeToken;
  let managerId;
  let employeeId;
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

    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    const employee = await User.create({
      name: 'Employee User',
      email: 'employee@example.com',
      password: 'password123',
      role: 'employee'
    });

    managerId = manager._id;
    employeeId = employee._id;
    managerToken = generateToken(manager._id);
    employeeToken = generateToken(employee._id);

    const suggestion = await Suggestion.create({
      title: 'Test Suggestion',
      description: 'Test Description',
      author: employeeId,
      status: 'New'
    });

    suggestionId = suggestion._id;
  });

  describe('PATCH /api/suggestions/:id/status', () => {
    it('should allow manager to change status', async () => {
      const res = await request(app)
        .patch(`/api/suggestions/${suggestionId}/status`)
        .set('Cookie', `token=${managerToken}`)
        .send({ status: 'Under Review' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.suggestion.status).toBe('Under Review');

      const updated = await Suggestion.findById(suggestionId);
      expect(updated.status).toBe('Under Review');
    });

    it('should not allow employee to change status', async () => {
      const res = await request(app)
        .patch(`/api/suggestions/${suggestionId}/status`)
        .set('Cookie', `token=${employeeToken}`)
        .send({ status: 'Approved' });

      expect(res.statusCode).toBe(403);
    });
  });
});

