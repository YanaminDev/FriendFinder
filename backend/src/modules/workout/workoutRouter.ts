import { Router } from "express";
import { workoutRepository } from './workoutRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreateWorkoutSchema, DeleteWorkoutSchema, UpdateWorkoutSchema } from './workoutModel'
import { authorize } from '../../common/middleware/authorize'

export const workoutRouter = () => {
    const router = Router();

    router.get("/workout", authenticateToken, async (req, res) => {
        try {
            const data = await workoutRepository.getWorkout();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch workout data" })
        }
    })

    router.get("/workout/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = Number(idParam);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID must be a number" });
            }

            const data = await workoutRepository.getWorkoutById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch workout data by id" })
        }
    })

    router.post("/create/workout", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreateWorkoutSchema.parse(req.body)
            const data = await workoutRepository.createWorkout(validateData)
            res.status(201).json(`create workout success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create workout data" })
        }
    })

    router.delete("/delete/workout", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteWorkoutSchema.parse(req.body)
            const data = await workoutRepository.deleteWorkout(validateData)
            res.status(200).json(`delete workout success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete workout data" })
        }
    })

    router.put("/update/workout", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdateWorkoutSchema.parse(req.body)
            const data = await workoutRepository.updateWorkout(validateData)
            res.status(200).json(`update workout success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update workout data" })
        }
    })

    return router;
}
