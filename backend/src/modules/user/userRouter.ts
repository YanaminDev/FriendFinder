import { Router } from "express";
import { userRepository } from "./userRepository";
import { UserSignupSchema , UserLoginSchema, ChangePasswordSchema, GoogleLoginSchema, GoogleSignupSchema } from "./userModel"
import {generateAccessToken,generateRefreshToken , verifyRefreshToken} from "../../common/utils/jwt"
import "dotenv/config"
import { authenticateToken } from "../../common/middleware/authenticate";
import { verifyToken } from "../../common/utils/jwt";
import {authorize} from '../../common/middleware/authorize'
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();
const GOOGLE_CLIENT_IDS = [
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
].filter(Boolean) as string[];


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
                    maxAge : 30 * 24 * 60 * 60 * 1000
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

    router.post("/google-login", async (req, res) => {
        try {
            const { idToken } = GoogleLoginSchema.parse(req.body);

            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_IDS.length ? GOOGLE_CLIENT_IDS : undefined,
            });
            const payload = ticket.getPayload();
            if (!payload?.sub) {
                return res.status(401).json({ message: "Invalid Google token" });
            }

            const google_id = payload.sub;
            const existing = await userRepository.findByGoogleId(google_id);

            if (!existing) {
                return res.status(200).json({
                    isNew: true,
                    google_id,
                    email: payload.email ?? null,
                    suggested_name: payload.name ?? payload.given_name ?? "",
                    picture: payload.picture ?? null,
                });
            }

            if (existing.isBanned) {
                return res.status(403).json({ message: "Your account has been banned" });
            }
            if (existing.isOnline) {
                return res.status(409).json({ message: "User already logged in elsewhere", is_online: true });
            }

            await userRepository.setUserOnline(existing.user_id, true);

            const accessToken = generateAccessToken({ user_id: existing.user_id, username: existing.username, role: existing.role });
            const refreshToken = generateRefreshToken({ user_id: existing.user_id });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                isNew: false,
                message: "Google login successful",
                user_id: existing.user_id,
                username: existing.username,
                role: existing.role,
                accessToken,
                refreshToken,
            });
        } catch (err: any) {
            console.error("Google login error:", err?.message);
            return res.status(401).json({ message: "Google authentication failed" });
        }
    });

    router.post("/google-register", async (req, res) => {
        try {
            const data = GoogleSignupSchema.parse(req.body);

            const existing = await userRepository.findByGoogleId(data.google_id);
            if (existing) {
                return res.status(409).json({ message: "Google account already registered" });
            }

            const user = await userRepository.registerWithGoogle(data);

            const accessToken = generateAccessToken({ user_id: user.user_id, username: user.username, role: user.role });
            const refreshToken = generateRefreshToken({ user_id: user.user_id });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json({
                message: "Google user registered successfully",
                user_id: user.user_id,
                username: user.username,
                accessToken,
                refreshToken,
            });
        } catch (err: any) {
            console.error("Google register error:", err?.message);
            return res.status(400).json({ message: err?.message || "Failed to register Google user" });
        }
    });

    router.post("/login" , async (req , res) => {
        try{
            const validateData = UserLoginSchema.parse(req.body);
            const responsedata = await userRepository.login(validateData);
            if (responsedata) {
                // Check if user is banned
                if (responsedata.isBanned) {
                    return res.status(403).json({
                        message: "Your account has been banned"
                    });
                }

                // Check if user is already online
                if (responsedata.isOnline) {
                    return res.status(409).json({
                        message: "User already logged in elsewhere",
                        is_online: true
                    });
                }

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
                    maxAge : 30 * 24 * 60 * 60 * 1000
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
        catch(err: any){
            console.log('❌ Login error:', err.message);
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
            try {
                await userRepository.setUserOnline(user_id, false);
            } catch (offlineErr) {
                console.error('Failed to set user offline:', offlineErr);
            }

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({message:"User logged out successfully", user_id})
        } catch (err) {
            console.error('Logout error:', err);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({message:"User logged out successfully"})
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

    router.get("/check-online-status/:user_id", async (req, res) => {
        try {
            const { user_id } = req.params;
            if (!user_id || typeof user_id !== "string") {
                return res.status(400).json({ message: "User ID is required" });
            }
            const isOnline = await userRepository.getOnlineStatus(user_id);
            return res.status(200).json({ is_online: isOnline });
        } catch (err) {
            return res.status(500).json({ message: "Failed to check online status" });
        }
    })

    // Used by sendBeacon on page unload — token verified in body since headers cannot be set
    router.post("/set-offline", async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) return res.status(400).json({ message: "Token required" });
            const decoded = verifyToken(token) as any;
            const user_id: string = decoded.sub ?? decoded.user_id;
            if (!user_id) return res.status(400).json({ message: "Invalid token" });
            await userRepository.setUserOnline(user_id, false);
            return res.status(200).json({ ok: true });
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    })

    router.put("/change-password", authenticateToken, async (req, res) => {
        try {
            const validateData = ChangePasswordSchema.parse(req.body);
            const user_id = (req as any).user.sub;
            const result = await userRepository.changePassword(user_id, validateData.oldPassword, validateData.newPassword);
            return res.status(200).json(result);
        } catch (err: any) {
            console.error("Change password error:", err);
            if (err.errors) {
                return res.status(400).json({ message: err.errors[0]?.message || "Invalid password format" });
            }
            return res.status(400).json({ message: err.message || "Failed to change password" });
        }
    })

    // ✅ Refresh access token
    router.post("/refresh", async (req, res) => {
        try {
            let refreshToken = req.cookies.refreshToken || req.body.token;
            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token" });
            }

            const decoded = await verifyRefreshToken(refreshToken);
            const user_id = decoded.sub;

            const user = await userRepository.getProfile(user_id);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            const newAccessToken = generateAccessToken({
                user_id: user.user_id,
                username: user.username,
                role: user.role
            });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            return res.status(200).json({
                accessToken: newAccessToken,
                user_id: user.user_id
            });
        } catch (err: any) {
            console.error("Token refresh error:", err);
            return res.status(401).json({ message: "Failed to refresh token" });
        }
    })

    return router


    
}

