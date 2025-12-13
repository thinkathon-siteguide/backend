import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UnauthorizedError } from '../core/error.response';
import { User } from '../modules/auth/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token. Please log in again.'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Your token has expired. Please log in again.'));
    } else {
      next(error);
    }
  }
};
