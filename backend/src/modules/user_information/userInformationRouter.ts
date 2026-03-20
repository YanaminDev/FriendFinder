import { Router } from "express";
import { userInformationRepository } from "./userInformationRepository";
import { CreateUserInformationSchema ,  GetUserInformationSchema,UpdateUserInformationBioSchema , UpdateUserInformationHeightSchema ,UpdateUserInformationBloodGroupSchema, UpdateUserInformationLanguageSchema , UpdateUserInformationEducationSchema} from "./userInformationModel"
import {generateAccessToken,generateRefreshToken , verifyRefreshToken} from "../../common/utils/jwt"
import "dotenv/config"
import { authenticateToken } from "../../common/middleware/authenticate"
import {authorize} from '../../common/middleware/authorize'
import { ca } from "zod/v4/locales";


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

            const validateData = GetUserInformationSchema.parse(req.params);
            const responsedata = await userInformationRepository.getUserInformation(validateData.user_id);
            return res.status(200).json(responsedata);
        }
        catch(err){
            return res.status(400).json({message:"Failed to get user information" + err})
        }
    })

    router.post("/updateInformation/bio" , authenticateToken , async (req , res) => {
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

    router.post("/updateInformation/height" , authenticateToken , async (req , res) => {
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

    router.post("/updateInformation/blood-group" , authenticateToken , async (req , res) => {
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

    router.post("/updateInformation/language" , authenticateToken , async (req , res) => {
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

    router.post("/updateInformation/education" , authenticateToken , async (req , res) => {
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


}