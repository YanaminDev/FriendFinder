import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import argon2 from 'argon2';

const connectionString = `${process.env.DIRECT_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Hash password with same options as backend (must match passwordSchema requirements)
    // Requirements: 8+ chars, uppercase, lowercase, digit, special char
    const adminPassword = await argon2.hash('Admin123!', {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 3,
      parallelism: 1
    });

    // Create or update admin user
    const admin = await prisma.user.upsert({
      where: { username: 'Adminz' },
      update: {},
      create: {
        user_show_name: 'Adminz',
        username: 'Adminz',
        password: adminPassword,
        sex: 'male',
        age: 20,
        interested_gender: 'female',
        birth_of_date: new Date('1994-01-15'),
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Username: Admin');
    console.log('Password: Admin123!');
    console.log('\nUser:', admin);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
