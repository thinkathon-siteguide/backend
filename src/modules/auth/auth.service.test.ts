import { signup, login } from './auth.service';
import { User } from './User';
import { BadRequestError, AuthFailureError } from '../../core/error.response';
import jwt from 'jsonwebtoken';

// Mock mongoose model
jest.mock('./models/User');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  const mockUserPayload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUserInstance = {
    _id: 'userid123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    toObject: jest.fn().mockReturnValue({
      _id: 'userid123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    }),
    correctPassword: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.sign as jest.Mock).mockReturnValue('mock_token');
  });

  describe('signup', () => {
    it('should create a new user and return token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUserInstance);

      const result = await signup(mockUserPayload);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserPayload.email });
      expect(User.create).toHaveBeenCalledWith(mockUserPayload);
      expect(result).toHaveProperty('token', 'mock_token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw BadRequestError if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUserInstance);

      await expect(signup(mockUserPayload)).rejects.toThrow(BadRequestError);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      // Mock the chainable .select() method
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUserInstance),
      };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      const result = await login({ email: 'test@example.com', password: 'password123' });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUserInstance.correctPassword).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(result).toHaveProperty('token', 'mock_token');
    });

    it('should throw BadRequestError if email/password missing', async () => {
      await expect(login({ email: '' })).rejects.toThrow(BadRequestError);
    });

    it('should throw AuthFailureError if user not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(AuthFailureError);
    });

    it('should throw AuthFailureError if password incorrect', async () => {
      const mockInstanceWithWrongPass = {
        ...mockUserInstance,
        correctPassword: jest.fn().mockResolvedValue(false),
      };
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockInstanceWithWrongPass),
      };
      (User.findOne as jest.Mock).mockReturnValue(mockQuery);

      await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(AuthFailureError);
    });
  });
});
