import { Router } from "express";
import { authenticateToken } from "../../common/middleware/authenticate"
import { authorize } from '../../common/middleware/authorize'
import { CreateUserImageSchema  , GetSignedUrlSchema , GetUserImageUrlSchema , DeleteUserImageUrlSchema,UpdateUserImageUrlSchema} from './userImageModel'
import {userImageRepository} from './userImageRepository'
import multer from "multer"
import { uploadFile } from "../../common/utils/uploadUserImage";

const upload = multer({ storage: multer.memoryStorage() })

export const userImageRouter = () => {
    const router = Router();

    router.post("/upload", authenticateToken, upload.single("image"), async (req, res) => {
        try{
            const userId = (req as any).user.sub
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
            return res.status(500).json({message:`Failed to upload user image ${err}` })
        }
    })
    // signed Url เขาถึง user image จากการเรียกใช้ getUserImagesSignedUrl แล้วส่ง userId มาให้เพื่อดึงข้อมูลภาพของ user นั้นๆ จากนั้นใน repository จะทำการสร้าง signed URL ให้กับแต่ละภาพและส่งกลับมาให้กับ client
    router.get("/get-signed-url/:userId", authenticateToken, async (req, res) => {
        try {
            const { userId } = GetSignedUrlSchema.parse(req.params);
            const userImages = await userImageRepository.getUserImagesSignedUrl(userId);
            return res.status(200).json(userImages);
        } catch (err) {
            return res.status(500).json({ message: `Failed to fetch user images: ${err}` });
        }
    });

    //  get public Url ของ user image ทีคนนั้นเป็นเจ้าของ โดยไม่ต้องสร้าง signed URL ซึ่งจะใช้สำหรับการแสดงภาพในหน้าโปรไฟล์ของผู้ใช้ โดยที่ไม่จำเป็นต้องมีการตรวจสอบสิทธิ์การเข้าถึงภาพนั้นๆ เพราะเป็น URL ที่สามารถเข้าถึงได้โดยตรงจาก Supabase Storage
    router.get("/get/:userId", authenticateToken, async (req, res) => {
        try{
            const { userId } = GetUserImageUrlSchema.parse(req.params);
            const usersub = (req as any).user.sub
            if (!usersub || typeof usersub !== "string") {
                return res.status(400).json({ message: "User ID not type required" });
            }
            
            if (usersub !== userId) {
                return res.status(400).json({ message: "User ID not match with token" });
            }

            const userImages = await userImageRepository.getUserImages(userId);
            return res.status(200).json(userImages);

        }
        catch(err){
            return res.status(500).json({ message: `Failed to fetch user images: ${err}` });
        }


    })

    router.delete("/delete/:imageId", authenticateToken, async (req, res) => {
        try{
            const {imageId} = DeleteUserImageUrlSchema.parse(req.params);
            
            const userId = (req as any).user.sub
            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ message: "User ID not found in token" });
            }

            const deleteResult = await userImageRepository.deleteUserImage(imageId, userId)
            return res.status(200).json(deleteResult);
        }
        catch(err){
            return res.status(500).json({message:`Failed to delete user image ${err}` })
        }
    })


    router.put("/update/:imageId" , authenticateToken ,   upload.single("image") , async (req,res) => {
        try{
            const {imageId} = UpdateUserImageUrlSchema.parse(req.params);
            const userId = (req as any).user.sub
            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ message: "User ID not found in token" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const userImageData = CreateUserImageSchema.parse(req.file)
            const uploadResult = await uploadFile(userImageData)
            const updatedUserImage = await userImageRepository.updateUserImage(imageId, userId, uploadResult)

            return res.status(200).json(updatedUserImage);
        }
        catch(err){
            return res.status(500).json({message:`Failed to update user image ${err}` })
        }
    })

    return router;
}
