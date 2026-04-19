import { Router } from 'express';
import "dotenv/config";
import { authenticateToken } from "../../common/middleware/authenticate";

export function mapRouter() {
  const router = Router();

  router.get('/token', authenticateToken, (req, res) => {
    const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN_DEV ?? process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
    res.json({ token });
  });

  return router;
}
