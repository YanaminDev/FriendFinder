import cors from 'cors';

export const corsMiddleware = cors({
  origin: [
    // Development
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://192.168.1.100:8081',
    'http://192.168.1.100:19000',
    'http://192.168.1.100:19001',
    // Production
    'https://api.friendsfinders.uk',
    'https://friendsfinders.uk',
    'https://www.friendsfinders.uk',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
