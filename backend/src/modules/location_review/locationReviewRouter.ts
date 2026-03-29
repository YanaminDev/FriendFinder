import { Router } from "express";
import { locationReviewRepository } from "./locationReviewRepository";
import {
    CreateLocationReviewSchema,
    GetLocationReviewSchema,
    GetUserLocationReviewSchema,
    GetLocationReviewByMatchIdSchema,
    DeleteLocationReviewSchema
} from "./locationReviewModel";
import { authenticateToken } from "../../common/middleware/authenticate";
import { authorize } from "../../common/middleware/authorize";


export const locationReviewRouter = () => {
    const router = Router();

    // Get review by ID
    router.get("/get/:review_id", authenticateToken, async (req, res) => {
        try {

            const review_id = String(req.params.review_id);
            if (!review_id) {
                return res.status(400).json({ message: "Review ID is required" });
            }
            const data = await locationReviewRepository.getLocationReviewById(review_id);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to fetch location review" });
        }
    });

    // Get all reviews by location
    router.get("/location/:location_id", authenticateToken, async (req, res) => {
        try {
            const location_id = String(req.params.location_id);
            if (!location_id) {
                return res.status(400).json({ message: "Location ID is required" });
            }
            const validateData = GetLocationReviewSchema.parse({location_id});
            const data = await locationReviewRepository.getLocationReviewsByLocation(validateData);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to fetch location reviews" });
        }
    });

    // Get all reviews by user
    router.get("/user/:user_id", authenticateToken, async (req, res) => {
        try {
            const user_id = String(req.params.user_id);
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const validateData = GetUserLocationReviewSchema.parse({ user_id });
            const data = await locationReviewRepository.getLocationReviewsByUser(validateData);
            res.status(200).json(data);
        }
        catch(err) {
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
            const validateData = GetLocationReviewByMatchIdSchema.parse({ match_id });
            const data = await locationReviewRepository.getLocationReviewsByMatchId(validateData);
            res.status(200).json(data);
        }
        catch(err) {
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
            const validateData = CreateLocationReviewSchema.parse(req.body);
            const data = await locationReviewRepository.createLocationReview(validateData);
            res.status(201).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to create location review" });
        }
    });

    // Delete review
    router.delete("/delete", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = DeleteLocationReviewSchema.parse(req.body);
            const data = await locationReviewRepository.deleteLocationReview(validateData , userId);
            res.status(200).json({ message: "Location review deleted successfully" });
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to delete location review" });
        }
    });

    router.delete("/delete", authenticateToken,authorize("admin"),  async (req, res) => {
        try {
            
            const validateData = DeleteLocationReviewSchema.parse(req.body);
            const data = await locationReviewRepository.deleteLocationReviewByAdmin(validateData);
            res.status(200).json({ message: "Location review deleted successfully" });
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to delete location review" });
        }
    });


    return router;
};