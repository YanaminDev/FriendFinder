import { Router } from "express";
import { userRepository } from "./userRepository";
import { UserSignupSchema , UserLoginSchema} from "./userModel"

export const userRouter = () => {
    const router = Router();

    router.post("/auth/register" , async (req , res) => {
        const validateData = UserSignupSchema.parse(req.body);
        const responsedata = await userRepository.register(validateData);
        if (responsedata) {
            return res.status(201).json(responsedata)
        }
        return res.status(400).json({message:"Failed to register user"})
    })

    router.post("/auth/login" , async (req , res) => {
        const validateData = UserLoginSchema.parse(req.body);
        const responsedata = await userRepository.login(validateData);
        if (responsedata) {
            return res.status(200).json(responsedata)
        }
        return res.status(400).json({message:"Failed to login user"})

    })


    
}

