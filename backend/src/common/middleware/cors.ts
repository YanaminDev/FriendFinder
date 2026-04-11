import cors from 'cors';

export const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8081', 'http://192.168.1.100:8081', 'http://192.168.1.100:19000', 'http://192.168.1.100:19001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
