import { Router } from "express";
import { userRepository } from "./userRepository";
import { UserSignupSchema , UserLoginSchema} from "./userModel"
import {generateAccessToken,generateRefreshToken , verifyRefreshToken} from "../../common/utils/jwt"
import "dotenv/config"
import { authenticateToken } from "../../common/middleware/authenticate"
import {authorize} from '../../common/middleware/authorize'


export const userRouter = () => {
    const router = Router();

    router.post("/check-username" , async (req , res) => {
        try{
            const { username } = req.body;
            if (!username) {
                return res.status(400).json({message:"Username is required"})
            }
            const existingUser = await userRepository.findByUsername(username);
            return res.status(200).json({exists: !!existingUser})
        }
        catch(err){
            return res.status(500).json({message:"Failed to check username"})
        }
    })

    router.post("/register" , async (req , res) => {
        try{
            const validateData = UserSignupSchema.parse(req.body);
            const responsedata = await userRepository.register(validateData);
            if (responsedata) {
                const accessToken = generateAccessToken({user_id: responsedata.user_id, username: responsedata.username, role: "user"});
                const refreshToken = generateRefreshToken({user_id: responsedata.user_id});

                res.cookie('accessToken',accessToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : 'strict',
                    maxAge : 15 * 60 * 1000
                })

                res.cookie('refreshToken', refreshToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : 'strict',
                    maxAge : 7 * 24 * 60 * 60 * 1000
                })

                return res.status(201).json({ message: "User registered successfully", user_id: responsedata.user_id, accessToken, refreshToken });

        }
        return res.status(400).json({message:"Failed to register user"})
        }
        catch(err: any){
            console.error("Register error:", err);
            if (err.message === "Username already exists") {
                return res.status(409).json({message:"Username already exists"})
            }
            return res.status(400).json({message: err.message || "Failed to register user"})
        }

    })

    router.post("/login" , async (req , res) => {
        try{
            const validateData = UserLoginSchema.parse(req.body);
            const responsedata = await userRepository.login(validateData);
            if (responsedata) {
                // Set user as online
                await userRepository.setUserOnline(responsedata.user_id, true);

                const accessToken = generateAccessToken({user_id: responsedata.user_id, username: responsedata.username, role: responsedata.role});
                const refreshToken = generateRefreshToken({user_id: responsedata.user_id});

                res.cookie('accessToken',accessToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : 'strict',
                    maxAge : 15 * 60 * 1000
                })

                res.cookie('refreshToken', refreshToken , {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : 'strict',
                    maxAge : 7 * 24 * 60 * 60 * 1000
                })

                return res.status(200).json({
                    message:"User logged in successfully",
                    user_id: responsedata.user_id,
                    username: responsedata.username,
                    role: responsedata.role,
                    accessToken,
                    refreshToken
                })
            }
            return res.status(400).json({message:"Failed to login user"})

        }
        catch(err){
            return res.status(400).json({message:"Invalid Credentials"})
        }
    })


    router.delete("/delete" , authenticateToken ,authorize("user","admin"), async (req,res) => {
        try{
            const refrshtoken = req.cookies.refreshToken
            const decoded = await verifyRefreshToken(refrshtoken)
            const responsedata = await userRepository.deleteUser(decoded.sub)
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({message:`User deleted successfully`})
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete user"})
        }
    }) 

    router.delete("/delete/:id" , authenticateToken ,authorize("admin"), async (req,res) => {
        try{
            const idParam = req.params.id

        if (typeof idParam !== "string") {
            return res.status(400).json({ message: "Invalid user id" })
        }
            const responsedata = await userRepository.deleteUserByAdmin(idParam)
            return res.status(200).json({message:`User deleted successfully`})
        }
        catch(err){
            return res.status(500).json({message:"Failed to delete user"})
        }
    }) 



    router.get("/profile", authenticateToken, authorize("user", "admin"), async (req, res) => {
        try {
            const user_id = (req as any).user.sub;
            const user = await userRepository.getProfile(user_id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: "Failed to get profile" });
        }
    })

    router.post("/logout" , authenticateToken ,authorize("user","admin"), async (req , res) => {
        try {
            const user_id = (req as any).user.sub;
            // Set user as offline
            await userRepository.setUserOnline(user_id, false);

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({message:"User logged out successfully"})
        } catch (err) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({message:"User logged out successfully"})
        }
    })

    router.put("/update/name", authenticateToken, async (req, res) => {
        try {
            const user_id = (req as any).user.sub;
            if (!user_id) {
                return res.status(400).json({ message: "User ID not found in token" });
            }
            const { user_show_name } = req.body;
            if (!user_show_name || typeof user_show_name !== "string" || user_show_name.trim().length === 0) {
                return res.status(400).json({ message: "user_show_name is required and cannot be empty" });
            }
            const updatedUser = await userRepository.updateUserShowName(user_id, user_show_name);
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(500).json({ message: "Failed to update user show name" });
        }
    })

    return router


    
}

