import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './asyncHandler';

describe('asyncHandler', () => {
  it('should catch errors and pass them to next', async () => {
    const error = new Error('Test error');
    const fn = async (_req: Request, _res: Response, _next: NextFunction) => {
      throw error;
    };

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await asyncHandler(fn)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call the function successfully', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await asyncHandler(fn)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
