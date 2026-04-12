import { Router } from "express";
import { activityRepository } from './activityRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreateActivitySchema, DeleteActivitySchema, UpdateActivitySchema } from './activityModel'
import { authorize } from '../../common/middleware/authorize'

export const activityRouter = () => {
    const router = Router();

    router.get("/activity",  async (req, res) => {
        try {
            const data = await activityRepository.getActivity();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch activity data" })
        }
    })

    router.get("/activity/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;
            const id = String(idParam);
            const data = await activityRepository.getActivityById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch activity data by id" })
        }
    })

    router.post("/create/activity", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreateActivitySchema.parse(req.body)
            const data = await activityRepository.createActivity(validateData)
            res.status(201).json({ message: "create activity success", data })
        }
        catch (err: any) {
            console.error("Create activity error:", err);
            return res.status(500).json({ message: err.message || "Failed to create activity data" })
        }
    })

    router.delete("/delete/activity", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteActivitySchema.parse(req.body)
            const data = await activityRepository.deleteActivity(validateData)
            res.status(200).json(`delete activity success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete activity data" })
        }
    })

    router.put("/update/activity", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdateActivitySchema.parse(req.body)
            const data = await activityRepository.updateActivity(validateData)
            res.status(200).json(`update activity success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update activity data" })
        }
    })

    return router;
}
