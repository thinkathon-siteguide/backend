import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalError,
  ErrorType
} from './error.response';

describe('Error Response Classes', () => {
  it('should create ApiError with correct properties', () => {
    const error = new ApiError(ErrorType.BAD_REQUEST, 'Custom Error', 400);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.type).toBe(ErrorType.BAD_REQUEST);
    expect(error.message).toBe('Custom Error');
    expect(error.statusCode).toBe(400);
  });

  it('should create BadRequestError', () => {
    const error = new BadRequestError();
    expect(error.type).toBe(ErrorType.BAD_REQUEST);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
  });

  it('should create UnauthorizedError', () => {
    const error = new UnauthorizedError();
    expect(error.type).toBe(ErrorType.UNAUTHORIZED);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });

  it('should create ForbiddenError', () => {
    const error = new ForbiddenError();
    expect(error.type).toBe(ErrorType.FORBIDDEN);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden');
  });

  it('should create NotFoundError', () => {
    const error = new NotFoundError();
    expect(error.type).toBe(ErrorType.NOT_FOUND);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not Found');
  });

  it('should create InternalError', () => {
    const error = new InternalError();
    expect(error.type).toBe(ErrorType.INTERNAL);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal Server Error');
  });
});
