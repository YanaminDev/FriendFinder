import "express"

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string
                username: string
                role: string
            }
        }
    }
}
