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
import { supabase } from '../../../lib/supabase';

export const matchRouter = () => {
    const router = Router();

    // Get active (non-cancelled, not ended) match for a user
    router.get("/active/:user_id", authenticateToken, async (req, res) => {
        try {
            const user_id = String(req.params.user_id);
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const data = await matchRepository.getActiveByUser(user_id);
            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to fetch active match" });
        }
    });

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

    // Get all matches with reviews (admin feedback page)
    router.get("/admin/all-reviews", authenticateToken, authorize("admin"), async (_req, res) => {
        try {
            const data = await matchRepository.getAllMatchesWithReviews();

            // Sign location image URLs
            const paths: { matchIdx: number; path: string }[] = [];
            data.forEach((match, idx) => {
                const img = match.location?.location_image?.[0];
                if (img?.imageUrl) {
                    const pathMatch = img.imageUrl.match(/location-images\/(.+)$/);
                    if (pathMatch) {
                        paths.push({ matchIdx: idx, path: `location-images/${pathMatch[1]}` });
                    }
                }
            });

            if (paths.length > 0) {
                const { data: signedData, error } = await supabase.storage
                    .from('locationImage')
                    .createSignedUrls(paths.map(p => p.path), 5 * 60);

                if (!error && signedData) {
                    signedData.forEach((signed, idx) => {
                        if (signed.signedUrl) {
                            const m = data[paths[idx].matchIdx];
                            if (m.location?.location_image?.[0]) {
                                (m.location.location_image[0] as any).imageUrl = signed.signedUrl;
                            }
                        }
                    });
                }
            }

            res.status(200).json(data);
        }
        catch(err) {
            return res.status(500).json({ message: "Failed to fetch reviews" });
        }
    });

    return router;
};