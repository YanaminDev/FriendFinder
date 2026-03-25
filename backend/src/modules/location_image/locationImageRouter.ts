import { Router } from "express";
import { authenticateToken } from "../../common/middleware/authenticate"
import { authorize } from '../../common/middleware/authorize'
import { CreateLocationImageSchema  , GetSignedUrlSchema , GetSignedUrlSchemaWithId , GetLocationImageUrlSchema , DeleteUserImageUrlSchema , UpdateUserImageUrlSchema , GetLocationImageUrlSchemaUserId} from './locationImageModel'
import {locationImageRepository} from './locationImageRepository'
import multer from "multer"
import { uploadFile } from "../../common/utils/uploadImage";

const upload = multer({ storage: multer.memoryStorage() })

export const locationImageRouter = () => {
    const router = Router();

    router.post("/upload", authenticateToken, authorize("admin"), upload.single("image"), async (req, res) => {
        try{
            const locationId = req.body.locationId
            if (!locationId) {
                return res.status(400).json({ message: "Location ID not found in request" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const locationImageData = CreateLocationImageSchema.parse(req.file)
            const uploadResult = await uploadFile(locationImageData , "locationImage" , "location-images")
            const locationImage = await locationImageRepository.createLocationImage({locationImageData: uploadResult, locationId})

            return res.status(201).json(locationImage);
        }
        catch(err){
            return res.status(500).json({message:`Failed to upload location image ${err}` })
        }
    })
    // signed Url เขาถึง location image จากการเรียกใช้ getLocationImagesSignedUrl แล้วส่ง locationId มาให้เพื่อดึงข้อมูลภาพของ location นั้นๆ จากนั้นใน repository จะทำการสร้าง signed URL ให้กับแต่ละภาพและส่งกลับมาให้กับ client
    router.get("/get-signed-url/:locationId", authenticateToken, async (req, res) => {
        try {
            const { locationId } = GetSignedUrlSchema.parse(req.params);
            const locationImages = await locationImageRepository.getLocationImagesSignedUrl(locationId);
            return res.status(200).json(locationImages);
        } catch (err) {
            return res.status(500).json({ message: `Failed to fetch location images: ${err}` });
        }
    });


    router.get("/get-signed-url/:locationId/:imageId" , authenticateToken , async (req,res) => {
        try{
            const { imageId , locationId } = GetSignedUrlSchemaWithId.parse(req.params);
            const locationImage = await locationImageRepository.getSignedUrlSchemaWithId(imageId, locationId);
            return res.status(200).json(locationImage);
        }
        catch(err){
            return res.status(500).json({message:`Failed to fetch location image signed url with id ${err}` })
        }
    })

    //  get public Url ของ location image ของ location นั้น โดยไม่ต้องสร้าง signed URL ซึ่งจะใช้สำหรับการแสดงภาพในหน้ารายละเอียดของสถานที่ โดยที่ไม่จำเป็นต้องมีการตรวจสอบสิทธิ์การเข้าถึงภาพนั้นๆ เพราะเป็น URL ที่สามารถเข้าถึงได้โดยตรงจาก Supabase Storage
    router.get("/get/:locationId", authenticateToken, async (req, res) => {
        try{
            const { locationId } = GetLocationImageUrlSchema.parse(req.params);

            const locationImages = await locationImageRepository.getLocationImages(locationId);
            return res.status(200).json(locationImages);

        }
        catch(err){
            return res.status(500).json({ message: `Failed to fetch location images: ${err}` });
        }


    })


    router.get("/get/:locationId/:imageId", authenticateToken, async (req, res) => {
        try{
            const {  imageId , locationId } = GetLocationImageUrlSchemaUserId.parse(req.params);

            const locationImages = await locationImageRepository.getLocationImagesById(imageId , locationId);
            return res.status(200).json(locationImages);

        }
        catch(err){
            return res.status(500).json({message:`Failed to fetch location image ${err}` })
        }
    })

    router.delete("/delete/:imageId", authenticateToken, authorize("admin"), async (req, res) => {
        try{
            const {imageId} = DeleteUserImageUrlSchema.parse(req.params);
            
            const locationId = req.body.locationId
            if (!locationId || typeof locationId !== "string") {
                return res.status(400).json({ message: "Location ID not found in request" });
            }

            const deleteResult = await locationImageRepository.deleteLocationImage(imageId, locationId)
            return res.status(200).json(deleteResult);
        }
        catch(err){
            return res.status(500).json({message:`Failed to delete location image ${err}` })
        }
    })


    router.put("/update/:imageId" , authenticateToken , authorize("admin") ,  upload.single("image") , async (req,res) => {
        try{
            const {imageId} = UpdateUserImageUrlSchema.parse(req.params);
            const locationId = req.body.locationId
            if (!locationId || typeof locationId !== "string") {
                return res.status(400).json({ message: "Location ID not found in request" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const locationImageData = CreateLocationImageSchema.parse(req.file)
            const uploadResult = await uploadFile(locationImageData , "locationImage" , "location-images")
            const updatedLocationImage = await locationImageRepository.updateLocationImage(imageId, locationId, uploadResult)

            return res.status(200).json(updatedLocationImage);
        }
        catch(err){
            return res.status(500).json({message:`Failed to update location image ${err}` })
        }
    })

    return router;
}
