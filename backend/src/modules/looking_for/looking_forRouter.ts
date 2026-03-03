import { Router } from "express";
import {lookingForRepository} from './looking_forRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import {CreateLookingForSchema,DeleteLookingForSchema , UpdateLookingForSchema} from './looking_forModel'

export const lookingForRouter = () => {
    const router = Router();

    router.get("/" , authenticateToken , async (req, res) => {
        try{
            const data = await lookingForRepository.getLookingFor();
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch looking for data" })
        }
    })

    router.post("/create/looking-for", authenticateToken , async (req,res) => {
        try{
            const validateData = CreateLookingForSchema.parse(req.body)
            const data = await lookingForRepository.createLookingFor(validateData)
            res.status(201).json(`create looking for success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to create looking for data" })
        }
    })


    router.delete("/delete/looking-for", authenticateToken , async (req,res) => {
        try{
            const validateData = DeleteLookingForSchema.parse(req.body)
            const data = await lookingForRepository.deleteLookingFor(validateData)
            res.status(200).json(`delete looking for success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete looking for data" })
        }
    })

    router.put("/update/looking-for", authenticateToken , async (req,res) => {
        try{
            const validateData = UpdateLookingForSchema.parse(req.body)
            const data = await lookingForRepository.updateLookingFor(validateData)
            res.status(200).json(`update looking for success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to update looking for data" })
        }
    })

    return router;
}