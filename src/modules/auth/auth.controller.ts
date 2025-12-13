import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { SuccessResponse } from '../../core/success.response';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await authService.signup(req.body);
    new SuccessResponse('Signup successful', { user, token }).send(res);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await authService.login(req.body);
    new SuccessResponse('Login successful', { user, token }).send(res);
  } catch (error) {
    next(error);
  }
};
