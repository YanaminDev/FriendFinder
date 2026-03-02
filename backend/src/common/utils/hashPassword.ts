
const argon2 = require('argon2');

export async function hashPassword(password: string): Promise<string>{
    try{
        return await argon2.hash(password, {type: argon2.argon2id,memoryCost: 19456,timeCost: 3,parallelism: 1})
    }
    catch(err){
        throw new Error("Password hashing failed")
        
    }
}

export async function verifyPassword(hash: string, password: string): Promise<boolean>{
    try{
        return await argon2.verify(hash, password)
    }
    catch(err){
        throw new Error("Password verification failed")    
    }
}