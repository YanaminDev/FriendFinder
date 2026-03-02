import "dotenv/config"
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '../generated/prisma/client' // ทำให้ backend เเละ copilot รู้จักกับ prisma
// npx prisma generate

const connectionString = `${process.env.DIRECT_URL}`

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

export {prisma}