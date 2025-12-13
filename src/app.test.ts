import request from 'supertest';
import app from './app';

describe('App', () => {
  it('should return 200 OK on root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('API is running');
  });

  it('should return 404 on unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('type', 'NotFoundError');
  });
});
