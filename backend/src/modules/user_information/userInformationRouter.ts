import { Router } from "express";
import { userInformationRepository } from "./userInformationRepository";
import { CreateUserInformationSchema ,  GetUserInformationSchema,UpdateUserInformationBioSchema , UpdateUserInformationHeightSchema ,UpdateUserInformationBloodGroupSchema, UpdateUserInformationLanguageSchema , UpdateUserInformationEducationSchema} from "./userInformationModel"
import "dotenv/config"
import { authenticateToken } from "../../common/middleware/authenticate"
import {authorize} from '../../common/middleware/authorize'
import { ca } from "zod/v4/locales";
import { userRepository } from "../user/userRepository";


export const userInformationRouter = () => {
    const router = Router();

    router.post("/create" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const validateData = CreateUserInformationSchema.parse(req.body);
            const responsedata = await userInformationRepository.createUserInformation(userId , validateData.user_height , validateData.user_bio || "" , validateData.blood_group || undefined , validateData.language_id || undefined , validateData.education_id || undefined);
            return res.status(201).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to create user information" + err})
        }
    })


    router.get("/get/:userId" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }

            const validateData = GetUserInformationSchema.parse({ user_id: req.params.userId });
            const responsedata = await userInformationRepository.getUserInformation(validateData.user_id);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to get user information" + err})
        }
    })

    router.put("/update/bio" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.body.user_bio) {
                return res.status(400).json({ message: "user_bio is required" });
            }

            const validateData = UpdateUserInformationBioSchema.parse(req.body);
            const responsedata = await userInformationRepository.updateUserInformationBio(userId , validateData.user_bio);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to update user information" + err})
        }
    }),

    router.put("/update/height" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.body.user_height) {
                return res.status(400).json({ message: "user_height is required" });
            }

            const validateData = UpdateUserInformationHeightSchema.parse(req.body);
            const responsedata = await userInformationRepository.updateUserInformationHeight(userId , validateData.user_height);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to update user information" + err})
        }
    }),

    router.put("/update/blood-group" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.body.blood_group) {
                return res.status(400).json({ message: "blood_group is required" });
            }

            const validateData = UpdateUserInformationBloodGroupSchema.parse(req.body);
            const responsedata = await userInformationRepository.updateUserInformationBloodGroup(userId , validateData.blood_group);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to update user information" + err})
        }
    }),

    router.put("/update/language" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.body.language_id) {
                return res.status(400).json({ message: "language_id is required" });
            }

            const validateData = UpdateUserInformationLanguageSchema.parse(req.body);
            const responsedata = await userInformationRepository.updateUserInformationLanguage(userId , validateData.language_id);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to update user information" + err})
        }
    }),

    router.put("/update/education" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            if (!req.body.education_id) {
                return res.status(400).json({ message: "education_id is required" });
            }

            const validateData = UpdateUserInformationEducationSchema.parse(req.body);
            const responsedata = await userInformationRepository.updateUserInformationEducation(userId , validateData.education_id);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to update user information" + err})
        }
    })

    router.put("/update/interested-gender", authenticateToken, async (req, res) => {
        try {
            const userId = (req as any).user.sub;
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const { interested_gender } = req.body;
            if (!['male', 'female', 'lgbtq'].includes(interested_gender)) {
                return res.status(400).json({ message: "Invalid interested_gender" });
            }
            const result = await userRepository.updateUserInterestedGender(userId, interested_gender);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({ message: "Failed to update interested gender" });
        }
    })

    router.delete("/delete" , authenticateToken , async (req , res) => {
        try{
            const userId = (req as any).user.sub
            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const responsedata = await userInformationRepository.deleteUserInformation(userId);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to delete user information" + err})
        }
    })

    return router;


}