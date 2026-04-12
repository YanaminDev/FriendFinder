import { prisma } from '../lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ select: { user_id: true, username: true, user_show_name: true }, take: 10 });
  console.log('USERS:', JSON.stringify(users));

  const matches = await prisma.match.findMany({ select: { id: true, user1_id: true, user2_id: true, location_id: true, activity_id: true, position_id: true }, take: 5 });
  console.log('MATCHES:', JSON.stringify(matches));

  const activities = await prisma.activity.findMany({ select: { id: true, name: true }, take: 5 });
  console.log('ACTIVITIES:', JSON.stringify(activities));

  const locations = await prisma.location.findMany({ select: { id: true, name: true, position_id: true }, take: 5 });
  console.log('LOCATIONS:', JSON.stringify(locations));

  const positions = await prisma.position.findMany({ select: { id: true, name: true }, take: 5 });
  console.log('POSITIONS:', JSON.stringify(positions));

  const expCount = await prisma.experience.count();
  const locRevCount = await prisma.location_review.count();
  const cancelCount = await prisma.cancellation.count();
  console.log('COUNTS: exp=' + expCount + ' locrev=' + locRevCount + ' cancel=' + cancelCount);

  await prisma.$disconnect();
}
main();
