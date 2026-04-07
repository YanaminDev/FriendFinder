import { Router } from 'express';
import "dotenv/config";

export function mapRouter() {
  const router = Router();

  router.get('/token', (req, res) => {
    res.json({ token: process.env.EXPO_PUBLIC_MAPBOX_TOKEN });
  });

  return router;
}
