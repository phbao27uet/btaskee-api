/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { ROOM_HAS_NAME } from '@utils/roomIds';

const prisma = new PrismaClient();

const generateTables = () => {
  const roomFilter = ROOM_HAS_NAME;

  const rooms = [...roomFilter];

  return rooms.map((room) => ({
    name: room.name,
    true_count: 0,
    running_count: 0,
    evolution_table_id: room.id,
    created_at: new Date(),
    updated_at: new Date(),
  }));
};

async function main() {
  await prisma.table.createMany({
    data: generateTables(),
    skipDuplicates: true,
  });

  console.log('seed success');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
