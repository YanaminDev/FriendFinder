import { Router } from "express";
import { locationProposalRepository } from "./locationProposalRepository";
import {
  CreateLocationProposalSchema,
  RespondLocationProposalSchema,
} from "./locationProposalModel";
import { authenticateToken } from "../../common/middleware/authenticate";

export const locationProposalRouter = () => {
  const router = Router();

  // สร้างคำเสนอสถานที่
  router.post("/create", authenticateToken, async (req, res) => {
    try {
      const proposer_id = (req as any).user.sub;
      const validateData = CreateLocationProposalSchema.parse({
        ...req.body,
        proposer_id,
      });
      const data = await locationProposalRepository.create(validateData);
      res.status(201).json(data);
    } catch (err: any) {
      console.error("Create location proposal error:", err);
      return res
        .status(500)
        .json({ message: err.message || "Failed to create location proposal" });
    }
  });

  // ดึง proposal ล่าสุดที่ยัง pending ของ match
  router.get("/match/:match_id", authenticateToken, async (req, res) => {
    try {
      const match_id = String(req.params.match_id);
      const data = await locationProposalRepository.getLatestPendingByMatch(match_id);
      res.status(200).json(data);
    } catch (err: any) {
      console.error("Get location proposal error:", err);
      return res
        .status(500)
        .json({ message: err.message || "Failed to fetch location proposal" });
    }
  });

  // ตอบรับ/ปฏิเสธ proposal
  router.put("/respond", authenticateToken, async (req, res) => {
    try {
      const validateData = RespondLocationProposalSchema.parse(req.body);
      const data = await locationProposalRepository.respond(validateData);
      res.status(200).json(data);
    } catch (err: any) {
      console.error("Respond location proposal error:", err);
      return res
        .status(500)
        .json({ message: err.message || "Failed to respond to location proposal" });
    }
  });

  return router;
};
