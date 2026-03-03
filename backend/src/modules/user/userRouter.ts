import { Router } from "express";
import { userRepository } from "./userRepository";
import { UserSignupSchema , UserLoginSchema} from "./userModel"
import {generateAccessToken,generateRefreshToken} from "../../common/utils/jwt"
import "dotenv/config"
import { authenticateToken } from "../../common/middleware/authenticate"

export const userRouter = () => {
    const router = Router();

    router.post("/register" , async (req , res) => {
        try{
            const validateData = UserSignupSchema.parse(req.body);
            const responsedata = await userRepository.register(validateData);
            if (responsedata) {
                const accessToken = generateAccessToken({user_id: responsedata.user_id, username: responsedata.username, role: "user"});
                const refreshToken = generateRefreshToken({user_id: responsedata.user_id});
                
                res.cookie('accessToken',accessToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'development',
                    sameSite : 'strict',
                    maxAge : 15 * 60 * 1000
                })

                res.cookie('refreshToken', refreshToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'development',
                    sameSite : 'strict',
                    maxAge : 7 * 24 * 60 * 60 * 1000
                })

                return res.status(201).json({ message: "User registered successfully" });

        }
        return res.status(400).json({message:"Failed to register user"})
        }
        catch(err){
            return res.status(400).json({message:"Failed to register user"})
        }
        
    })

    router.post("/login" , async (req , res) => {
        try{
            const validateData = UserLoginSchema.parse(req.body);
            const responsedata = await userRepository.login(validateData);
            if (responsedata) {
                const accessToken = generateAccessToken({user_id: responsedata.user_id, username: responsedata.username, role: "user"});
                const refreshToken = generateRefreshToken({user_id: responsedata.user_id});

                res.cookie('accessToken',accessToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'development',
                    sameSite : 'strict',
                    maxAge : 15 * 60 * 1000
                })

                res.cookie('refreshToken', refreshToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'development',
                    sameSite : 'strict',
                    maxAge : 7 * 24 * 60 * 60 * 1000
                })

                return res.status(200).json({message:"User logged in successfully"})
            }
            return res.status(400).json({message:"Failed to login user"})

        }
        catch(err){
            return res.status(400).json({message:"Invalid Credentials"})
        }
    })

    return router


    
}

