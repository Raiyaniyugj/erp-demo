const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Endpoints', () => {
  it('should return 401 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: '',
      password: ''
    });
    expect(res.statusCode).toEqual(401);
  });
});
