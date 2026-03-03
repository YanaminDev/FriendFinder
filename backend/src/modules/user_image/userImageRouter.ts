import { Router } from "express";
import { authenticateToken } from "../../common/middleware/authenticate"
import { authorize } from '../../common/middleware/authorize'
import { CreateUserImageSchema } from './userImageModel'
import {userImageRepository} from './userImageRepository'
import multer from "multer"
import { uploadFile } from "../../common/utils/uploadUserImage";

const upload = multer({ storage: multer.memoryStorage() })

export const userImageRouter = () => {
    const router = Router();

    router.post("/upload", authenticateToken, upload.single("image"), async (req, res) => {
        try{
            const userId = (req as any).user.id
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const userImageData = CreateUserImageSchema.parse(req.file)
            const uploadResult = await uploadFile(userImageData)
            const userImage = await userImageRepository.createUserImage({userImageData: uploadResult, userId})

            return res.status(201).json(userImage);
        }
        catch(err){
            return res.status(500).json({message:"Failed to upload user image" })
        }
    })


    return router;
}
