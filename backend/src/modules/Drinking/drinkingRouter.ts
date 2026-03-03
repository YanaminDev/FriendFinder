import { Router } from "express";
import {drinkingRepository} from './drinkingRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import {CreateLookingForSchema,DeleteLookingForSchema , UpdateLookingForSchema} from './looking_forModel'

export const drinkingRouter = () => {
    const router = Router();

    router.get("/drinking" , authenticateToken , async (req, res) => {
        try{
            const data = await drinkingRepository.getDrinking();
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch drinking data" })
        }
    })

    router.get("/drinking/:id", authenticateToken , async (req,res) => {
        try{
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = Number(idParam);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID must be a number" });
            }

            const data = await drinkingRepository.getLookingForById(id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch looking for data by id" })
        }
        
    })

    router.post("/create/drinking", authenticateToken , async (req,res) => {
        try{
            const validateData = CreateLookingForSchema.parse(req.body)
            const data = await lookingForRepository.createLookingFor(validateData)
            res.status(201).json(`create looking for success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to create looking for data" })
        }
    })


    router.delete("/delete/drinking", authenticateToken , async (req,res) => {
        try{
            const validateData = DeleteLookingForSchema.parse(req.body)
            const data = await lookingForRepository.deleteLookingFor(validateData)
            res.status(200).json(`delete looking for success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete looking for data" })
        }
    })


    router.put("/update/drinking", authenticateToken , async (req,res) => {
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