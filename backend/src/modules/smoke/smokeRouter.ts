import { Router } from "express";
import { smokeRepository } from './smokeRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreateSmokeSchema, DeleteSmokeSchema, UpdateSmokeSchema } from './smokeModel'
import { authorize } from '../../common/middleware/authorize'

export const smokeRouter = () => {
    const router = Router();

    router.get("/get", authenticateToken, async (req, res) => {
        try {
            const data = await smokeRepository.getSmoke();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch smoke data" })
        }
    })

    router.get("/get/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = String(idParam);
            

            const data = await smokeRepository.getSmokeById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch smoke data by id" })
        }
    })

    router.post("/create", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreateSmokeSchema.parse(req.body)
            const data = await smokeRepository.createSmoke(validateData)
            res.status(201).json(`create smoke success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create smoke data" })
        }
    })

    router.delete("/delete", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteSmokeSchema.parse(req.body)
            const data = await smokeRepository.deleteSmoke(validateData)
            res.status(200).json(`delete smoke success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete smoke data" })
        }
    })

    router.put("/update", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdateSmokeSchema.parse(req.body)
            const data = await smokeRepository.updateSmoke(validateData)
            res.status(200).json(`update smoke success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update smoke data" })
        }
    })

    return router;
}
