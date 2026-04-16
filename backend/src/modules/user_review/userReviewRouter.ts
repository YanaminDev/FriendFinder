import { Router } from "express";
import { userReviewRepository } from "./userReviewRepository";
import {
    CreateUserReviewSchema,
    GetUserReviewSchema,
    GetUserReviewByMatchIdSchema,
    DeleteUserReviewSchema
} from "./userReviewModel";
import { authenticateToken } from "../../common/middleware/authenticate";
import { authorize } from "../../common/middleware/authorize";

export const userReviewRouter = () => {
    const router = Router();

    // Get review by ID
    router.get("/get/:review_id", authenticateToken, async (req, res) => {
        try {
            const review_id = String(req.params.review_id);
            if (!review_id) {
                return res.status(400).json({ message: "Review ID is required" });
            }
            const data = await userReviewRepository.getUserReviewById(review_id);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch user review" });
        }
    });

    // Get all reviews about a user
    router.get("/user/:reviewed_user_id", authenticateToken, async (req, res) => {
        try {
            const reviewed_user_id = String(req.params.reviewed_user_id);
            if (!reviewed_user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const validateData = GetUserReviewSchema.parse({ reviewed_user_id });
            const data = await userReviewRepository.getUserReviewsByUser(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch user reviews" });
        }
    });

    // Get all reviews by match
    router.get("/match/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = GetUserReviewByMatchIdSchema.parse({ match_id });
            const data = await userReviewRepository.getUserReviewsByMatchId(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch match reviews" });
        }
    });

    // Create review
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = CreateUserReviewSchema.parse(req.body);
            const data = await userReviewRepository.createUserReview(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create user review" });
        }
    });

    // Delete review
    router.delete("/delete", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = DeleteUserReviewSchema.parse(req.body);
            const data = await userReviewRepository.deleteUserReview(validateData, userId);
            res.status(200).json({ message: "User review deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete user review" });
        }
    });

    // Delete review by admin
    router.delete("/delete", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteUserReviewSchema.parse(req.body);
            const data = await userReviewRepository.deleteUserReviewByAdmin(validateData);
            res.status(200).json({ message: "User review deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete user review" });
        }
    });

    return router;
};
