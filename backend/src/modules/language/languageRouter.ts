import { Router } from "express";
import {languageRepository} from './languageRepository'
import { authenticateToken } from "../../common/middleware/authenticate"
import {CreateLanguageForSchema,DeleteLanguageForSchema , UpdateLanguageForSchema} from './languageModel'
import {authorize} from '../../common/middleware/authorize'

export const languageRouter = () => {
    const router = Router();

    router.get("/language" , authenticateToken , async (req, res) => {
        try{
            const data = await languageRepository.getLanguage();
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch language data" })
        }
    })

    router.get("/language/:id", authenticateToken , async (req,res) => {
        try{
            const idParam = req.params.id;

            if (typeof idParam !== "string") {
                return res.status(400).json({ message: "Invalid id parameter" });
            }
            const id = Number(idParam);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID must be a number" });
            }

            const data = await languageRepository.getLanguageById(id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch language data by id" })
        }
        
    })

    router.post("/create/language", authenticateToken ,authorize("admin") , async (req,res) => {
        try{
            const validateData = CreateLanguageForSchema.parse(req.body)
            const data = await languageRepository.createLanguage(validateData)
            res.status(201).json(`create language success`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to create language data" })
        }
    })


    router.delete("/delete/language", authenticateToken ,authorize("admin") , async (req,res) => {
        try{
            const validateData = DeleteLanguageForSchema.parse(req.body)
            const data = await languageRepository.deleteLanguage(validateData)
            res.status(200).json(`delete language success`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete language data" })
        }
    })


    router.put("/update/language", authenticateToken ,authorize("admin") , async (req,res) => {
        try{
            const validateData = UpdateLanguageForSchema.parse(req.body)
            const data = await languageRepository.updateLanguage(validateData)
            res.status(200).json(`update language success ${data}`)
        }
        catch(err){
            return res.status(500).json({message:"Failed to update language data" })
        }
    })

    

    return router;
}