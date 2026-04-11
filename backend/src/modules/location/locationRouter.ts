import {authorize} from '../../common/middleware/authorize'
import { authenticateToken } from "../../common/middleware/authenticate"
import { Router } from "express";
import { locationRepository } from './locationRepository'
import {CreateLocationSchema , GetLocationByIdSchema , DeleteLocationSchema , UpdateLocationSchema} from './locationModel'
import { ca } from 'zod/v4/locales';

export const locationRouter = () => {
    const router = Router();

    router.get("/get/:id" , authenticateToken , async (req, res) => {
        try{
            const id = String(req.params.id);
            const data = await locationRepository.getLocationbyid(id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch location data" })
        }
    })

    router.get("/get" , authenticateToken , async (req, res) => {
        try{
            const data = await locationRepository.getLocation();
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch location data" })
        }
    })

    router.get("/get/:position_id" , authenticateToken , async (req, res) => { 
        try{
            const position_id = String(req.params.position_id);
            const data = await locationRepository.getLocationByPositionId(position_id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch location data" })
        }
    })

    router.get("/get-by-position/:position_id" , authenticateToken , async (req, res) => {
        try{
            const position_id = String(req.params.position_id);
            const data = await locationRepository.getLocationByPositionId(position_id);
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to fetch location data" })
        }
    })

    router.post("/create" , authenticateToken , authorize("admin") , async (req, res) => {
        try{
            const validateData = CreateLocationSchema.parse(req.body)
            const data = await locationRepository.createLocation(validateData)
            res.status(201).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to create location data" })
        }

    })

    router.put("/update/:id" , authenticateToken , authorize("admin") , async (req, res) => {
        try{
            const id = String(req.params.id);
            const validateData = UpdateLocationSchema.parse(req.body)
            const data = await locationRepository.updateLocation(id , validateData)
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to update location data" })
        }
    })

    router.delete("/delete/:id" , authenticateToken , authorize("admin") , async (req, res) => {
        try{
            const id = String(req.params.id);
            const data = await locationRepository.deleteLocation(id)
            res.status(200).json(data)
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete location data" })
        }
    })



    router.post

    return router;
}