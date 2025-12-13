export enum ErrorType {
  BAD_REQUEST = 'BadRequestError',
  UNAUTHORIZED = 'UnauthorizedError',
  FORBIDDEN = 'ForbiddenError',
  NOT_FOUND = 'NotFoundError',
  INTERNAL = 'InternalError',
}

export class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number,
    public rawErrors?: any[]
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', rawErrors?: any[]) {
    super(ErrorType.BAD_REQUEST, message, 400, rawErrors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(ErrorType.UNAUTHORIZED, message, 401);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message: string = 'Authentication Failure') {
    super(ErrorType.UNAUTHORIZED, message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(ErrorType.FORBIDDEN, message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(ErrorType.NOT_FOUND, message, 404);
  }
}

export class InternalError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(ErrorType.INTERNAL, message, 500);
  }
}
