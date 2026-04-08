import { Router } from "express";
import { matchRepository } from "./matchRepository";
import {
    CreateMatchSchema,
    GetMatchSchema,
    UpdateMatchLocationSchema,
    UpdateMatchCancelStatusSchema,
    UpdateMatchEndSchema,
    DeleteMatchSchema
} from "./matchModel";
import { authenticateToken } from "../../common/middleware/authenticate";
import { authorize } from "../../common/middleware/authorize";

export const matchRouter = () => {
    const router = Router();

    // Get match by ID
    router.get("/get/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = GetMatchSchema.parse({ match_id });
            const data = await matchRepository.getMatchById(validateData);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to fetch match" });
        }
    });

    // Create match
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const validateData = CreateMatchSchema.parse(req.body);
            const data = await matchRepository.createMatch(validateData);
            res.status(201).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to create match" });
        }
    });

    // Update match cancel status
    router.put("/update/cancel-status/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = UpdateMatchCancelStatusSchema.parse(req.body);
            const data = await matchRepository.updateMatchCancelStatus(match_id, validateData);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to update match status" });
        }
    });

    // Update match end date
    router.put("/update/end-match/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = UpdateMatchEndSchema.parse(req.body);
            const data = await matchRepository.updateMatchEndDate(match_id, validateData);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to update match end date" });
        }
    });

    // Update match location
    router.put("/update/location/:match_id", authenticateToken, async (req, res) => {
        try {
            const match_id = String(req.params.match_id);
            if (!match_id) {
                return res.status(400).json({ message: "Match ID is required" });
            }
            const validateData = UpdateMatchLocationSchema.parse(req.body);
            const data = await matchRepository.updateMatchLocation(match_id, validateData);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to update match location" });
        }
    });

    // Delete match
    router.delete("/delete", authenticateToken,authorize("admin"), async (req, res) => {
        try {
            const validateData = DeleteMatchSchema.parse(req.body);
            const data = await matchRepository.deleteMatch(validateData);
            res.status(200).json({ message: "Match deleted successfully" });
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to delete match" });
        }
    });

    return router;
};