import { Router } from "express";
import { cancellationRepository } from "./cancellationRepository";
import {
    CreateCancellationSchema,
    GetCancellationSchema,
    GetCancellationByMatchSchema,
    GetCancellationByUserSchema,
    GetCancellationByReviewerSchema,
    DeleteCancellationSchema
} from "./cancellationModel";
import { authenticateToken } from "../../common/middleware/authenticate";

export const cancellationRouter = () => {
    const router = Router();

    // Create cancellation
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const validateData = CreateCancellationSchema.parse(req.body);
            const data = await cancellationRepository.createCancellation(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create cancellation" });
        }
    });

    // Get cancellation by ID
    router.get("/get/:cancellation_id", authenticateToken, async (req, res) => {
        try {
            const cancellation_id = String(req.params.cancellation_id);
            if (!cancellation_id) {
                return res.status(400).json({ message: "Cancellation ID is required" });
            }
            const validateData = GetCancellationSchema.parse({ cancellation_id });
            const data = await cancellationRepository.getCancellation(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch cancellation" });
        }
    });

    // Get cancellations by match
    router.get("/match/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = GetCancellationByMatchSchema.parse({ match_id });
            const data = await cancellationRepository.getCancellationByMatch(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch cancellations" });
        }
    });

    // Get cancellations by user
    router.get("/user/:user_id", authenticateToken, async (req, res) => {
        try {
            const user_id = String(req.params.user_id);
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const validateData = GetCancellationByUserSchema.parse({ user_id });
            const data = await cancellationRepository.getCancellationByUser(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch cancellations" });
        }
    });

    // Get cancellations by reviewer (user who initiated the cancellation)
    router.get("/reviewer/:reviewer_id", authenticateToken, async (req, res) => {
        try {
            const reviewer_id = String(req.params.reviewer_id);
            if (!reviewer_id) {
                return res.status(400).json({ message: "Reviewer ID is required" });
            }
            const validateData = GetCancellationByReviewerSchema.parse({ reviewer_id });
            const data = await cancellationRepository.getCancellationByReviewer(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch cancellations" });
        }
    });

    // Delete cancellation
    router.delete("/delete/:cancellation_id", authenticateToken, async (req, res) => {
        try {
            const cancellation_id = String(req.params.cancellation_id);
            if (!cancellation_id) {
                return res.status(400).json({ message: "Cancellation ID is required" });
            }
            const validateData = DeleteCancellationSchema.parse({ cancellation_id });
            await cancellationRepository.deleteCancellation(validateData);
            res.status(200).json({ message: "Cancellation deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete cancellation" });
        }
    });

    return router;
};