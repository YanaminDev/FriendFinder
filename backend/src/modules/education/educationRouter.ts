import { Router } from "express";
import { educationRepository } from './educationRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreateEducationSchema, DeleteEducationSchema, UpdateEducationSchema } from './educationModel'
import { authorize } from '../../common/middleware/authorize'

export const educationRouter = () => {
    const router = Router();

    router.get("/education", authenticateToken, async (req, res) => {
        try {
            const data = await educationRepository.getEducation();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch education data" })
        }
    })

    router.get("/education/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = String(idParam);
            

            const data = await educationRepository.getEducationById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch education data by id" })
        }
    })

    router.post("/create/education", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreateEducationSchema.parse(req.body)
            const data = await educationRepository.createEducation(validateData)
            res.status(201).json(`create education success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create education data" })
        }
    })

    router.delete("/delete/education", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteEducationSchema.parse(req.body)
            const data = await educationRepository.deleteEducation(validateData)
            res.status(200).json(`delete education success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete education data" })
        }
    })

    router.put("/update/education", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdateEducationSchema.parse(req.body)
            const data = await educationRepository.updateEducation(validateData)
            res.status(200).json(`update education success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update education data" })
        }
    })

    return router;
}
