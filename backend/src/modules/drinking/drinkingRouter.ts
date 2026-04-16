import { Router } from "express";
import {drinkingRepository} from './drinkingRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import {CreateDrinkingSchema,DeleteDrinkingSchema , UpdateDrinkingSchema} from './drinkingModel'
import {authorize} from '../../common/middleware/authorize'

export const drinkingRouter = () => {
    const router = Router();

    router.get("/get" , async (req, res) => {
        try{
            const data = await drinkingRepository.getDrinking();
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch drinking data" })
        }
    })

    router.get("/get/:id", authenticateToken , async (req,res) => {
        try{
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            
            const id = String(idParam);
            

            const data = await drinkingRepository.getDrinkingById(id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch drinking data by id" })
        }
        
    })

    router.post("/create", authenticateToken ,authorize("admin")  , async (req,res) => {
        try{
            const validateData = CreateDrinkingSchema.parse(req.body)
            const data = await drinkingRepository.createDrinking(validateData)
            res.status(201).json(`create drinking success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to create drinking data" })
        }
    })


    router.delete("/delete", authenticateToken ,authorize("admin") , async (req,res) => {
        try{
            const validateData = DeleteDrinkingSchema.parse(req.body)
            const data = await drinkingRepository.deleteDrinking(validateData)
            res.status(200).json(`delete drinking success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete drinking data" })
        }
    })


    router.put("/update", authenticateToken ,authorize("admin") , async (req,res) => {
        try{
            const validateData = UpdateDrinkingSchema.parse(req.body)
            const data = await drinkingRepository.updateDrinking(validateData)
            res.status(200).json(`update drinking success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to update drinking data" })
        }
    })

    

    return router;
}