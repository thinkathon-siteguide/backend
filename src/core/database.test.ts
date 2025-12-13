import mongoose from 'mongoose';
import { connectDatabase } from './database';
import { logger } from './logger';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
  },
}));

describe('Database Connection', () => {
  const exitMock = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to database successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    
    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should exit process on connection failure', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('Could not connect to MongoDB', error);
    expect(exitMock).toHaveBeenCalledWith(1);
  });

  it('should log warning on disconnection', () => {
    // Trigger the disconnected event handler
    const onCallback = (mongoose.connection.on as jest.Mock).mock.calls[0][1];
    onCallback();

    expect(logger.warn).toHaveBeenCalledWith('MongoDB disconnected');
  });
});
