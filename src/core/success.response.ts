import { Response } from 'express';

export class SuccessResponse {
  constructor(
    public message: string,
    public data: any = {},
    public statusCode: number = 200
  ) {}

  send(res: Response) {
    return res.status(this.statusCode).json({
      status: 'success',
      message: this.message,
      data: this.data,
    });
  }
}
