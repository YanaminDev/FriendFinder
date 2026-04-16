import { Router, Request, Response } from 'express';
import { userLifeStyleRepository } from './userLifeStyleRepository';
import {
  CreateUserLifeStyleSchema,
  GetUserLifeStyleSchema,
  UpdateUserLifeStyleLookingForSchema,
  UpdateUserLifeStyleDrinkingSchema,
  UpdateUserLifeStylePetSchema,
  UpdateUserLifeStyleSmokeSchema,
  UpdateUserLifeStyleWorkoutSchema
} from './userLifeStyleModel';
import { authenticateToken } from '../../common/middleware/authenticate';


export const userLifeStyleRouter = () => {
  const router = Router();

  // Create user life style
  router.post('/create', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const data = CreateUserLifeStyleSchema.parse(req.body);
      const result = await userLifeStyleRepository.create(userId, data.looking_for_id, data.drinking_id, data.pet_id, data.smoke_id, data.workout_id);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Get user life style
  router.get('/get/:userId', authenticateToken, async (req: Request, res: Response) => {
    try {
      const {user_id } = GetUserLifeStyleSchema.parse({ user_id: req.params.userId })
      const result = await userLifeStyleRepository.findByUserId(user_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });



  // Update looking for
  router.put('/update/looking-for', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const { looking_for_id } = UpdateUserLifeStyleLookingForSchema.parse(req.body);
      const result = await userLifeStyleRepository.updateLookingFor(userId, looking_for_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Update drinking
  router.put('/update/drinking', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const { drinking_id } = UpdateUserLifeStyleDrinkingSchema.parse(req.body);
      const result = await userLifeStyleRepository.updateDrinking(userId, drinking_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Update pet
  router.put('/update/pet', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const { pet_id } = UpdateUserLifeStylePetSchema.parse(req.body);
      const result = await userLifeStyleRepository.updatePet(userId, pet_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Update smoke
  router.put('/update/smoke', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const { smoke_id } = UpdateUserLifeStyleSmokeSchema.parse(req.body);
      const result = await userLifeStyleRepository.updateSmoke(userId, smoke_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Update workout
  router.put('/update/workout', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      const { workout_id } = UpdateUserLifeStyleWorkoutSchema.parse(req.body);
      const result = await userLifeStyleRepository.updateWorkout(userId, workout_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Delete user life style
  router.delete('/delete', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.sub
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in token" });
      }
      await userLifeStyleRepository.delete(userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  return router;

}



