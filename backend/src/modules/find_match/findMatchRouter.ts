import { Router } from "express";
import { findMatchRepository } from "./findMatchRepository";
import {
    CreateFindMatchSchema,
    SearchFindMatchSchema,
    GetFindMatchSchema,
    DeleteFindMatchSchema,
    UpdateFindMatchSchema
} from "./findMatchModel";
import { authenticateToken } from "../../common/middleware/authenticate";


export const findMatchRouter = () => {
    const router = Router();

    // Get find match by user ID
    router.get("/get/:user_id", authenticateToken, async (req, res) => {
        try {
            const user_id = String(req.params.user_id);
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const validateData = GetFindMatchSchema.parse({ user_id });
            const data = await findMatchRepository.getFindMatchByUserId(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch find match" });
        }
    });

    // Create find match
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = CreateFindMatchSchema.parse(req.body);
            const data = await findMatchRepository.createFindMatch(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create find match" });
        }
    });

    // Delete find match
    router.delete("/delete", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = DeleteFindMatchSchema.parse({ user_id: userId });
            await findMatchRepository.deleteFindMatch(validateData);
            res.status(200).json({ message: "Find match deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete find match" });
        }
    });

    // Search find match
    router.post("/search", authenticateToken, async (req, res) => {
        try {
            const validateData = SearchFindMatchSchema.parse(req.body);
            const data = await findMatchRepository.searchFindMatch(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to search find match" });
        }
    });

    // Update find match
    router.put("/update", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = UpdateFindMatchSchema.parse({ ...req.body, user_id: userId });
            const data = await findMatchRepository.updateFindMatch(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update find match" });
        }
    });

    return router;
};
