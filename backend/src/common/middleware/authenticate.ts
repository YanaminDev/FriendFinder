import "dotenv/config"
import {verifyToken} from "../utils/jwt"
import {Request, Response, NextFunction} from 'express'
import { prisma } from "../../../lib/prisma";
import {generateAccessToken , verifyRefreshToken} from "../utils/jwt"


const jwt = require('jsonwebtoken')


export async function authenticateToken(req : Request , res : Response , next : NextFunction){
    const accessToken = req.cookies.accessToken
    const refrshtoken = req.cookies.refreshToken

    try{
        if(accessToken){
            const decoded = await verifyToken(accessToken)
            ;(req as any).user = decoded
            return next()
        }
        if(refrshtoken){
            const decoded = await verifyRefreshToken(refrshtoken)
            const user = await prisma.user.findUnique({
                where : {user_id : decoded.sub}
            })
            if(!user){
                return res.status(401).json({message:"Refresh token invalid"})
            }
            const newAccessToken = await generateAccessToken({user_id : user.user_id, username : user.username, role : user.role});
                    
            res.cookie('accessToken', newAccessToken , {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'development',
                sameSite : 'strict',
                maxAge : 15 * 60 * 1000
            });

            ;(req as any).user = await verifyToken(newAccessToken)
            return next()
        }
        return res.status(401).json({ message: "Not authenticated" })
        
    }
    catch(err : any){

        if(err instanceof jwt.TokenExpiredError && refrshtoken){
            try{
                const decoded = await verifyRefreshToken(refrshtoken)
                const user = await prisma.user.findUnique({
                    where : {user_id : decoded.sub}
                })
                if(!user){
                    return res.status(401).json({message:"Refresh token invalid"})
                }
                const newAccessToken = await generateAccessToken({user_id : user.user_id, username : user.username, role : user.role});
                        
                res.cookie('accessToken', newAccessToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'development',
                    sameSite : 'strict',
                    maxAge : 15 * 60 * 1000
                });

                ;(req as any).user = {
                    sub : user.user_id,
                    username : user.username,
                    role : user.role
                }
                return next()
            }
            catch(err){
            return res.status(401).json({ message: "Invalid refresh token" })
            }
        }  
        return res.status(401).json({ message: "Invalid access token and refresh token" })
            
    }
}

