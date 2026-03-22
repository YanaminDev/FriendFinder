import { Router } from "express";
import { selectCancelRepository } from './selectCancelRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreateSelectCancelSchema, DeleteSelectCancelSchema, UpdateSelectCancelSchema } from './selectCancelModel'
import { authorize } from '../../common/middleware/authorize'

export const selectCancelRouter = () => {
    const router = Router();

    router.get("/select-cancel", authenticateToken, async (req, res) => {
        try {
            const data = await selectCancelRepository.getSelectCancel();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch select cancel data" })
        }
    })

    router.get("/select-cancel/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = String(idParam);
            

            const data = await selectCancelRepository.getSelectCancelById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch select cancel data by id" })
        }
    })

    router.post("/create/select-cancel", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreateSelectCancelSchema.parse(req.body)
            const data = await selectCancelRepository.createSelectCancel(validateData)
            res.status(201).json(`create select cancel success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create select cancel data" })
        }
    })

    router.delete("/delete/select-cancel", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteSelectCancelSchema.parse(req.body)
            const data = await selectCancelRepository.deleteSelectCancel(validateData)
            res.status(200).json(`delete select cancel success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete select cancel data" })
        }
    })

    router.put("/update/select-cancel", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdateSelectCancelSchema.parse(req.body)
            const data = await selectCancelRepository.updateSelectCancel(validateData)
            res.status(200).json(`update select cancel success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update select cancel data" })
        }
    })

    return router;
}
