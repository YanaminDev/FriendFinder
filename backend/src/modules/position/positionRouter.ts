import { Router } from "express";
import { positionRepository } from "./positionRepository";
import {
    CreatePositionSchema,
    GetPositionSchema,
    UpdatePositionSchema,
    DeletePositionSchema,
    SearchPositionSchema
} from "./positionModel";
import { authenticateToken } from "../../common/middleware/authenticate";
import { authorize } from "../../common/middleware/authorize";
import multer from "multer";
import { uploadFile } from "../../common/utils/uploadImage";

const upload = multer({ storage: multer.memoryStorage() });

export const positionRouter = () => {
    const router = Router();

    // Create position
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const validateData = CreatePositionSchema.parse(req.body);
            const data = await positionRepository.createPosition(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create position" });
        }
    });

    // Get all positions
    router.get("/get", authenticateToken, async (req, res) => {
        try {
            const data = await positionRepository.getAllPositions();
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch positions" });
        }
    });

    // Get position by ID
    router.get("/get/:position_id", authenticateToken, async (req, res) => {
        try {
            const position_id = String(req.params.position_id);
            if (!position_id) {
                return res.status(400).json({ message: "Position ID is required" });
            }
            const validateData = GetPositionSchema.parse({ position_id });
            const data = await positionRepository.getPosition(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch position" });
        }
    });

    // Update position
    router.put("/update/:position_id", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const position_id = String(req.params.position_id);
            if (!position_id) {
                return res.status(400).json({ message: "Position ID is required" });
            }
            const validateData = UpdatePositionSchema.parse({ ...req.body, position_id });
            const data = await positionRepository.updatePosition(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to update position" });
        }
    });

    // Delete position
    router.delete("/delete/:position_id", authenticateToken,authorize("admin"), async (req, res) => {
        try {
            const position_id = String(req.params.position_id);
            if (!position_id) {
                return res.status(400).json({ message: "Position ID is required" });
            }
            const validateData = DeletePositionSchema.parse({ position_id });
            await positionRepository.deletePosition(validateData);
            res.status(200).json({ message: "Position deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete position" });
        }
    });

    // Search nearby positions
    router.post("/search-nearby", authenticateToken, async (req, res) => {
        try {
            const validateData = SearchPositionSchema.parse(req.body);
            const data = await positionRepository.searchPosition(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to search nearby positions" });
        }
    });

    // Upload position image (single)
    router.post("/upload-image/:position_id", authenticateToken, authorize("admin"), upload.single("image"), async (req, res) => {
        try {
            const positionId = String(req.params.position_id);
            if (!positionId) {
                return res.status(400).json({ message: "Position ID not found" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const uploadResult = await uploadFile(req.file, "positionImage", "position-images");
            const position = await positionRepository.updatePositionImage(positionId, uploadResult.imageUrl);

            return res.status(201).json(position);
        } catch (err) {
            return res.status(500).json({ message: `Failed to upload position image: ${err}` });
        }
    });

    // Upload multiple position images (up to 4)
    router.post("/upload-images/:position_id", authenticateToken, authorize("admin"), upload.array("images", 4), async (req, res) => {
        try {
            const positionId = String(req.params.position_id);
            if (!positionId) {
                return res.status(400).json({ message: "Position ID not found" });
            }
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const urls: string[] = [];
            for (const file of files) {
                const result = await uploadFile(file, "positionImage", "position-images");
                urls.push(result.imageUrl);
            }

            const position = await positionRepository.updatePositionImage(positionId, JSON.stringify(urls));
            return res.status(201).json(position);
        } catch (err) {
            return res.status(500).json({ message: `Failed to upload position images: ${err}` });
        }
    });

    return router;
};