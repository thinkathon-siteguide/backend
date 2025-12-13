import request from 'supertest';
import app from '../../app';
import { User } from './models/User';
import mongoose from 'mongoose';

// We need to mock the database connection for integration tests 
// or use an in-memory database like mongodb-memory-server.
// For this environment, we will mock the service calls to test routes/controllers mostly,
// NOT full database integration if we want "error free" without setting up a real DB.
// HOWEVER, "Integration Test" usually implies DB. 
// Given the user wants "test coverage", I will mock the Service layer for the Route tests 
// to isolate the controller/route logic and handle Express mechanics.
// AND/OR we can mock the Mongoose models directly.

// Strategy: Mock the database operations to avoid needing a running MongoDB instance.

jest.mock('./models/User');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should register a user successfully', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue({
            _id: 'userid123',
            name: 'New User',
            email: 'new@example.com',
            toObject: () => ({ name: 'New User', email: 'new@example.com' }),
        });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail if email already exists', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ _id: 'existing' });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          name: 'Existing',
          email: 'exists@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400); // BadRequest
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
        const mockUser = {
            _id: 'userid123',
            email: 'test@example.com',
            password: 'hashed',
            correctPassword: jest.fn().mockResolvedValue(true),
            toObject: () => ({ email: 'test@example.com' })
        };
        const mockQuery = { select: jest.fn().mockResolvedValue(mockUser) };
        (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with wrong credentials', async () => {
        const mockUser = {
            _id: 'userid123',
            email: 'test@example.com',
            password: 'hashed',
            correctPassword: jest.fn().mockResolvedValue(false), // Wrong pass
             toObject: () => ({ email: 'test@example.com' })
        };
        const mockQuery = { select: jest.fn().mockResolvedValue(mockUser) };
        (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401); // Unauthorized/AuthFailure
    });
  });
});
