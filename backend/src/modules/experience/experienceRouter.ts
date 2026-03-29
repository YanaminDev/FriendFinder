import { Router } from "express";
import { experienceRepository } from "./experienceRepository";
import {
    CreateExperienceSchema,
    GetExperienceSchema,
    GetExperienceByMatchSchema,
    GetExperienceByReviewerSchema,
    GetExperienceByRevieweeSchema,
    UpdateExperienceSchema,
    DeleteExperienceSchema
} from "./experienceModel";
import { authenticateToken } from "../../common/middleware/authenticate";

export const experienceRouter = () => {
    const router = Router();

    // Create experience
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const validateData = CreateExperienceSchema.parse(req.body);
            const data = await experienceRepository.createExperience(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create experience" });
        }
    });

    // Get experience by ID
    router.get("/get/:experience_id", authenticateToken, async (req, res) => {
        try {
            const experience_id = String(req.params.experience_id);
            if (!experience_id) {
                return res.status(400).json({ message: "Experience ID is required" });
            }
            const validateData = GetExperienceSchema.parse({ experience_id });
            const data = await experienceRepository.getExperience(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch experience" });
        }
    });

    // Get experiences by match
    router.get("/match/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = GetExperienceByMatchSchema.parse({ match_id });
            const data = await experienceRepository.getExperienceByMatch(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch experiences" });
        }
    });

    // Get experiences by reviewer
    router.get("/reviewer/:reviewer_id", authenticateToken, async (req, res) => {
        try {
            const reviewer_id = String(req.params.reviewer_id);
            if (!reviewer_id) {
                return res.status(400).json({ message: "Reviewer ID is required" });
            }
            const validateData = GetExperienceByReviewerSchema.parse({ reviewer_id });
            const data = await experienceRepository.getExperienceByReviewer(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch experiences" });
        }
    });

    // Get experiences by reviewee
    router.get("/reviewee/:reviewee_id", authenticateToken, async (req, res) => {
        try {
            const reviewee_id = String(req.params.reviewee_id);
            if (!reviewee_id) {
                return res.status(400).json({ message: "Reviewee ID is required" });
            }
            const validateData = GetExperienceByRevieweeSchema.parse({ reviewee_id });
            const data = await experienceRepository.getExperienceByReviewee(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch experiences" });
        }
    });

    // Update experience
    router.put("/update/:experience_id", authenticateToken, async (req, res) => {
        try {
            const experience_id = String(req.params.experience_id);
            if (!experience_id) {
                return res.status(400).json({ message: "Experience ID is required" });
            }
            const validateData = UpdateExperienceSchema.parse({ ...req.body, experience_id });
            const data = await experienceRepository.updateExperience(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update experience" });
        }
    });

    // Delete experience
    router.delete("/delete/:experience_id", authenticateToken, async (req, res) => {
        try {
            const experience_id = String(req.params.experience_id);
            if (!experience_id) {
                return res.status(400).json({ message: "Experience ID is required" });
            }
            const validateData = DeleteExperienceSchema.parse({ experience_id });
            await experienceRepository.deleteExperience(validateData);
            res.status(200).json({ message: "Experience deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete experience" });
        }
    });

    return router;
};