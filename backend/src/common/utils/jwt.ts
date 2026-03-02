import "dotenv/config"

const jwt = require('jsonwebtoken')

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets not defined in .env")
}

interface userpayload {
    user_id: string
    username: string
    role: string
}

interface userIdpayload {
    user_id: string
}



export function generateAccessToken(user: userpayload): string {

    const payload = {
        sub: user.user_id,
        username: user.username,
        role: user.role
    }
    
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '10m' })
}

export function generateRefreshToken(user: userIdpayload): string {
    const payload = {
        sub : user.user_id
    }
    
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}



export function verifyToken(token: string){
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET) 
        return decoded
    } catch (err) {
        console.error('Token verification failed:')
        return null
    }
}


export function verifyRefreshToken(token: string){    
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) 
        return decoded
    } catch (err) {
        console.error('Refresh token verification failed:')
        return null
    }
}






