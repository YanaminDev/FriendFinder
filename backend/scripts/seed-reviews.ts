import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding mock reviews...');

  // Existing users
  const user1Id = '7fd23b56-528e-4eb6-8eda-205df8c61276'; // YanaminDev
  const user2Id = '9dbe44ed-a680-49eb-81f2-547fb6bf38ec'; // Gussuke
  const user3Id = 'f400fc5b-093b-405c-af37-7fcbf6aea656'; // TITLE

  // Existing data
  const activityGaming = '7fa02232-e966-47fa-afe3-557afb10aa86';
  const activityCoffee = '427bd516-16df-404f-9789-85c9b22c4be9';
  const activityRestaurant = '2cb9e8e1-61d4-45dc-a695-a27b458e0e4e';

  const positionPantip = 'b7656ee8-e3f2-4919-8360-060d2303751a';
  const positionAMP = 'ae15d9f5-ba06-4a09-96c7-323d2a907816';
  const positionDPU = '5c0f89ef-5cac-4ab9-b142-9bbe11c7162f';

  const locationKaiTod = '11688de6-8a0f-4465-9923-e6eba329be35'; // ร้านไก่ทอด
  const locationKanomKrok = '3005886f-2a48-4dd4-b117-1a15a7482dbc'; // ร้านขนมครก
  const locationCrepe = 'b76d22db-c568-4619-bac6-37ee88bcfe19'; // เครปโคดหวาน

  // Create a Select_Cancel option if not exists
  const selectCancel = await prisma.select_Cancel.upsert({
    where: { name: 'มาไม่ตรงเวลา' },
    update: {},
    create: { name: 'มาไม่ตรงเวลา' },
  });

  // ─── Match 1: YanaminDev + Gussuke ─── Gaming at ร้านไก่ทอด (AMP ตลาดอมรพันธ์)
  const match1 = await prisma.match.create({
    data: {
      user1_id: user1Id,
      user2_id: user2Id,
      activity_id: activityGaming,
      position_id: positionAMP,
      location_id: locationKaiTod,
    },
  });
  console.log('✅ Match 1 created:', match1.id);

  // Experience reviews for match1
  await prisma.experience.createMany({
    data: [
      {
        match_id: match1.id,
        reviewer_id: user1Id,
        reviewee_id: user2Id,
        status: 1, // positive
        content: 'คุยสนุกมากครับ เป็นคนน่าคุยด้วย นัดกันอีกได้เลย 👍',
      },
      {
        match_id: match1.id,
        reviewer_id: user2Id,
        reviewee_id: user1Id,
        status: 1, // positive
        content: 'พี่เค้าเป็นคนดีมากเลยค่ะ ชวนเล่นเกมสนุกด้วย',
      },
    ],
  });

  // Location reviews for match1
  await prisma.location_review.createMany({
    data: [
      {
        match_id: match1.id,
        location_id: locationKaiTod,
        user_id: user1Id,
        status: 1,
        review_text: 'ร้านไก่ทอดอร่อยมากครับ กรอบนอกนุ่มใน ราคาไม่แพง แนะนำเลย',
      },
      {
        match_id: match1.id,
        location_id: locationKaiTod,
        user_id: user2Id,
        status: 1,
        review_text: 'ร้านนี้ไก่ทอดสดใหม่ทุกวันค่ะ รสชาติจัดจ้าน ชอบมาก!',
      },
    ],
  });
  console.log('✅ Match 1 reviews created');

  // ─── Match 2: YanaminDev + TITLE ─── Coffee at ร้านขนมครก (AMP ตลาดอมรพันธ์)
  const match2 = await prisma.match.create({
    data: {
      user1_id: user1Id,
      user2_id: user3Id,
      activity_id: activityCoffee,
      position_id: positionAMP,
      location_id: locationKanomKrok,
    },
  });
  console.log('✅ Match 2 created:', match2.id);

  // Experience reviews for match2
  await prisma.experience.createMany({
    data: [
      {
        match_id: match2.id,
        reviewer_id: user1Id,
        reviewee_id: user3Id,
        status: 0, // negative
        content: 'มาสายประมาณ 30 นาที ไม่ค่อยพูดคุยด้วยเท่าไหร่ เล่นโทรศัพท์ตลอด',
      },
      {
        match_id: match2.id,
        reviewer_id: user3Id,
        reviewee_id: user1Id,
        status: 1,
        content: 'พี่เค้าใจดีครับ เลี้ยงกาแฟให้ด้วย คุยเรื่อง coding สนุกมาก',
      },
    ],
  });

  // Location reviews for match2
  await prisma.location_review.createMany({
    data: [
      {
        match_id: match2.id,
        location_id: locationKanomKrok,
        user_id: user1Id,
        status: 0,
        review_text: 'ร้านขนมครกวันนี้ไม่ค่อยร้อน รอนานมากกว่าจะได้ ไม่ประทับใจเท่าไหร่',
      },
      {
        match_id: match2.id,
        location_id: locationKanomKrok,
        user_id: user3Id,
        status: 1,
        review_text: 'ขนมครกอร่อยครับ หอมกะทิ กรอบนอกนุ่มใน สั่งไป 3 ถาด',
      },
    ],
  });
  console.log('✅ Match 2 reviews created');

  // ─── Match 3: Gussuke + TITLE ─── Restaurant at เครปโคดหวาน (AMP ตลาดอมรพันธ์) — with cancellation
  const match3 = await prisma.match.create({
    data: {
      user1_id: user2Id,
      user2_id: user3Id,
      activity_id: activityRestaurant,
      position_id: positionAMP,
      location_id: locationCrepe,
      cancel_status: true,
    },
  });
  console.log('✅ Match 3 created:', match3.id);

  // Cancellation for match3
  await prisma.cancellation.create({
    data: {
      match_id: match3.id,
      reviewer_id: user2Id,
      reviewee_id: user3Id,
      quick_select_id: selectCancel.id,
      content: 'รอไป 1 ชั่วโมงไม่มา ไม่ตอบแชท ไม่รับสาย ผิดหวังมากค่ะ',
    },
  });

  // Location review only (no experience) for match3
  await prisma.location_review.createMany({
    data: [
      {
        match_id: match3.id,
        location_id: locationCrepe,
        user_id: user2Id,
        status: 1,
        review_text: 'ร้านเครปอร่อยมากค่ะ น้ำจิ้มเด็ด แป้งบางกรอบ ถึงจะโดนเท แต่ร้านนี้ปลอบใจได้',
      },
    ],
  });
  console.log('✅ Match 3 reviews + cancellation created');

  console.log('\n📊 Mock reviews seeded successfully!');
  console.log('  - 3 matches with locations');
  console.log('  - 4 experience reviews (Thai)');
  console.log('  - 5 location reviews (Thai)');
  console.log('  - 1 cancellation (Thai)');

  await prisma.$disconnect();
}

main();
