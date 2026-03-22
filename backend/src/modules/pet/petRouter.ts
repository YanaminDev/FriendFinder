import { Router } from "express";
import { petRepository } from './petRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import { CreatePetSchema, DeletePetSchema, UpdatePetSchema } from './petModel'
import { authorize } from '../../common/middleware/authorize'

export const petRouter = () => {
    const router = Router();

    router.get("/get", authenticateToken, async (req, res) => {
        try {
            const data = await petRepository.getPet();
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch pet data" })
        }
    })

    router.get("/get/:id", authenticateToken, async (req, res) => {
        try {
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = String(idParam);
            
            const data = await petRepository.getPetById(id);
            res.status(200).json(data)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch pet data by id" })
        }
    })

    router.post("/create", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = CreatePetSchema.parse(req.body)
            const data = await petRepository.createPet(validateData)
            res.status(201).json(`create pet success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create pet data" })
        }
    })

    router.delete("/delete", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeletePetSchema.parse(req.body)
            const data = await petRepository.deletePet(validateData)
            res.status(200).json(`delete pet success`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete pet data" })
        }
    })

    router.put("/update", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = UpdatePetSchema.parse(req.body)
            const data = await petRepository.updatePet(validateData)
            res.status(200).json(`update pet success ${data}`)
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update pet data" })
        }
    })

    return router;
}
