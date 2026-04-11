import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        user_show_name: 'Admin',
        username: 'admin',
        password: '$argon2id$v=19$m=19456,t=3,p=1$TjIydXoyQnhJejdPRjllWA$w2rWCOYPsq+gxNkTDZvJsG4PcSJbG8YTjaDZuPz0X+0', // password: admin123
        sex: 'M',
        age: 30,
        birth_of_date: new Date('1994-01-01'),
        interested_gender: 'F',
        role: 'admin',
      },
    });
    console.log('✅ Admin user created:', adminUser.username);

    // Create regular user
    const regularUser = await prisma.user.upsert({
      where: { username: 'testuser' },
      update: {},
      create: {
        user_show_name: 'Test User',
        username: 'testuser',
        password: '$argon2id$v=19$m=19456,t=3,p=1$TjIydXoyQnhJejdPRjllWA$w2rWCOYPsq+gxNkTDZvJsG4PcSJbG8YTjaDZuPz0X+0', // password: admin123
        sex: 'F',
        age: 25,
        birth_of_date: new Date('1999-05-15'),
        interested_gender: 'M',
        role: 'user',
      },
    });
    console.log('✅ Test user created:', regularUser.username);

    // Create another regular user
    const user3 = await prisma.user.upsert({
      where: { username: 'john_doe' },
      update: {},
      create: {
        user_show_name: 'John Doe',
        username: 'john_doe',
        password: '$argon2id$v=19$m=19456,t=3,p=1$TjIydXoyQnhJejdPRjllWA$w2rWCOYPsq+gxNkTDZvJsG4PcSJbG8YTjaDZuPz0X+0', // password: admin123
        sex: 'M',
        age: 28,
        birth_of_date: new Date('1996-03-20'),
        interested_gender: 'F',
        role: 'user',
      },
    });
    console.log('✅ User 3 created:', user3.username);

    console.log('\n📊 Database seeded successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('  Admin: admin / admin123');
    console.log('  User: testuser / admin123');
    console.log('  User: john_doe / admin123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
