import "dotenv/config"
import {verifyToken} from "../utils/jwt"
import {Request, Response, NextFunction} from 'express'
import { prisma } from "../../../lib/prisma";
import {generateAccessToken , verifyRefreshToken} from "../utils/jwt"

const jwt = require('jsonwebtoken')


export async function authenticateToken(req : Request , res : Response , next : NextFunction){
    const token = req.cookies.accessToken
    
    if(!token){
        return res.status(401).json({message:"Access token missing"})
    }

    try{
        const decoded = verifyToken(token)
        req.user = decoded
        return next()
    }
    catch(err){
        if(err instanceof jwt.TokenExpiredError){
            const refreshToken = req.cookies.refreshToken
            if(refreshToken){
                try{
                    const decoded = await verifyRefreshToken(refreshToken)
                    const user = await prisma.user.findUnique({
                        where : {user_id : decoded.sub}
                    })
                    if(!user){
                        return res.status(401).json({message:"Refresh token invalid"})
                    }
                    const newAccessToken = await generateAccessToken({user_id : user.user_id, username : user.username, role : "user"});
                    
                    res.cookie('accessToken', newAccessToken , {
                        httpOnly : true,
                        secure : process.env.NODE_ENV === 'development',
                        sameSite : 'strict',
                        maxAge : 15 * 60 * 1000
                    });

                    req.user = verifyToken(newAccessToken)
                    return next()
                }
                catch(err){
                    return res.status(401).json({message:"Invalid refresh token"})
                }
                ;
            }
            return res.status(401).json({message:"Resfresh token missing"})
        }
        return res.status(401).json({message:"Invalid access token"})
    }

}