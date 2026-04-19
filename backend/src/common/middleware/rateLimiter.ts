import rateLimit from "express-rate-limit";
import { Request } from "express";

export const aiRecommendLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    keyGenerator: (req: Request) => {
        return (req as any).user?.sub ?? "unauthenticated";
    },
    skip: (req: Request) => !(req as any).user?.sub,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many AI requests, please try again later" },
});
