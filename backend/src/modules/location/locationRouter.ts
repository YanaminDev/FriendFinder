import {authorize} from '../../common/middleware/authorize'
import { authenticateToken } from "../../common/middleware/authenticate"
import { Router } from "express";
import { locationRepository } from './locationRepository'
import {CreateLocationSchema , GetLocationByIdSchema , DeleteLocationSchema , UpdateLocationSchema} from './locationModel'
import { ca } from 'zod/v4/locales';
import { supabase } from '../../../lib/supabase';

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

    router.get("/get-by-position-with-images/:position_id" , authenticateToken , async (req, res) => {
        try{
            const position_id = String(req.params.position_id);
            const locations = await locationRepository.getLocationWithImagesByPositionId(position_id);

            // Collect all image paths
            const allImages: { locationIdx: number; imageIdx: number; path: string }[] = [];
            locations.forEach((loc, locIdx) => {
                loc.location_image.forEach((img, imgIdx) => {
                    const pathMatch = img.imageUrl.match(/location-images\/(.+)$/);
                    const fileName = pathMatch ? pathMatch[1] : null;
                    if (fileName) {
                        allImages.push({ locationIdx: locIdx, imageIdx: imgIdx, path: `location-images/${fileName}` });
                    }
                });
            });

            // Batch sign all URLs in one call
            if (allImages.length > 0) {
                const paths = allImages.map(i => i.path);
                const { data: signedData, error } = await supabase.storage
                    .from('locationImage')
                    .createSignedUrls(paths, 5 * 60);

                if (!error && signedData) {
                    signedData.forEach((signed, idx) => {
                        if (signed.signedUrl) {
                            const { locationIdx, imageIdx } = allImages[idx];
                            (locations[locationIdx].location_image[imageIdx] as any).imageUrl = signed.signedUrl;
                        }
                    });
                }
            }

            res.status(200).json(locations)
        }
        catch(err){
            console.error("Failed to fetch locations with images:", err);
            return res.status(500).json({message:"Failed to fetch location data with images" })
        }
    })

    router.post("/create" , authenticateToken , async (req, res) => {
        try{
            const validateData = CreateLocationSchema.parse(req.body)
            const data = await locationRepository.createLocation(validateData)
            res.status(201).json(data)
        }
        catch(err){
            console.error("Location create error:", err)
            return res.status(500).json({message:"Failed to create location data" })
        }

    })

    router.put("/update/:id" , authenticateToken , async (req, res) => {
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

    router.delete("/delete/:id" , authenticateToken , async (req, res) => {
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