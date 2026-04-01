import { Router } from 'express';

export function mapRouter() {
  const router = Router();

  router.get('/token', (req, res) => {
    res.json({ token: process.env.MAPBOX_TOKEN });
  });

  return router;
}
