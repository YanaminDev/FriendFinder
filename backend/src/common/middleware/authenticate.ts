import "dotenv/config"
import {verifyToken} from "../utils/jwt"
import {Request, Response, NextFunction} from 'express'



function authenticateToken(req : Request , res : Response , next : NextFunction){
    
    const authHeader = req.headers['authorization']
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    
    if(!token){
        return res.status(401).json({message:"Access token missing"})
    }

    try{
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    }
    catch(err){
        if(err == "TokenExpiredError"){
            return res.status(401).json({message:"Access token expired"})
        }
        return res.status(401).json({message:"Invalid access token"})
    }

}


module.exports = {authenticateToken}