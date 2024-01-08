/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { ROOM_HAS_NAME, ROOM_IDS } from '../src/utils/roomIds';

const prisma = new PrismaClient();

const generateUsers = async () => {
  const password = await argon2.hash('123123a');

  return [
    {
      id: 1,
      name: 'Zen 1',
      email: 'zen_1@gmail.com',
      status: 'PENDING',
      password: password,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
};

const generateAdmins = async () => {
  const password = await argon2.hash('123123a');

  return [
    {
      id: 1,
      name: 'Zen Admin',
      email: 'zen_admin@gmail.com',
      password: password,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
};

const generateTables = () => {
  const roomFilter = ROOM_HAS_NAME.filter((room) => ROOM_IDS.includes(room.id));

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
  const users = await generateUsers();
  const admins = await generateAdmins();

  await prisma.user.createMany({
    // @ts-ignore
    data: users,
    skipDuplicates: true,
  });

  await prisma.admin.createMany({
    data: admins,
    skipDuplicates: true,
  });

  await prisma.table.createMany({
    data: generateTables(),
    skipDuplicates: true,
  });

  await prisma.trueCountSetting.create({
    data: {
      id: 1,
      true_count: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  await prisma.mGroup.createMany({
    data: [
      {
        id: 1,
        name: 'A', // Development team
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'B', // Expensive tools team
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'C', // Low cost tools team
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'D', // 1 day free trial team
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
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
