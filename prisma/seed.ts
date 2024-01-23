/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { WEBSITES } from '@utils/constants';
import * as argon2 from 'argon2';

import { BC_ROOMS } from 'src/websites/bc';
import { BIT_CASINO_ROOMS } from 'src/websites/bit-casino';
import { BONS_ROOMS } from 'src/websites/bons';
import { ELDOAH_ROOMS } from 'src/websites/eldoah';
import { FORTUNE_ROOMS } from 'src/websites/fortune';
import { STAKE_ROOMS } from 'src/websites/stake';
import { TEDBET_ROOMS } from 'src/websites/tedbet';
import { TOTAL_ROOM } from 'src/websites/total-room';

const isBelongTo = (room: any, obj: any) => {
  return obj.some((item: any) => item.id === room);
};

const rooms = TOTAL_ROOM.map((room) => {
  const platforms = [];

  if (isBelongTo(room.id, BC_ROOMS)) {
    platforms.push(WEBSITES['BC_game']);
  }

  if (isBelongTo(room.id, STAKE_ROOMS)) {
    platforms.push(WEBSITES['stake']);
  }

  if (isBelongTo(room.id, ELDOAH_ROOMS)) {
    platforms.push(WEBSITES['ELDOAH']);
  }

  if (isBelongTo(room.id, FORTUNE_ROOMS)) {
    platforms.push(WEBSITES['Fortune']);
  }

  if (isBelongTo(room.id, BIT_CASINO_ROOMS)) {
    platforms.push(WEBSITES['Bit_Casino']);
  }

  if (isBelongTo(room.id, BONS_ROOMS)) {
    platforms.push(WEBSITES['Bonds_Casino']);
  }

  if (isBelongTo(room.id, TEDBET_ROOMS)) {
    platforms.push(WEBSITES['TED_BET']);
  }

  return { ...room, platforms };
});

const generateTables = () => {
  // console.log('rooms', rooms);

  return rooms.map((room) => {
    return {
      name: room.name,
      true_count: 0,
      running_count: 0,
      evolution_table_id: room.id,
      is_reset_true_count: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
};

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

  // await prisma.table.createMany({
  //   data: generateTables(),
  //   skipDuplicates: true,
  // });

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

  await prisma.mWebsite.createMany({
    data: Object.values(WEBSITES).map((web) => ({
      name: web,
      created_at: new Date(),
      updated_at: new Date(),
    })),
    skipDuplicates: true,
  });

  await prisma.table.createMany({
    data: generateTables(),
    skipDuplicates: true,
  });

  for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < rooms[i].platforms.length; j++) {
      const website = await prisma.mWebsite.findFirst({
        where: {
          name: rooms[i].platforms[j],
        },
      });

      await prisma.websiteTable.create({
        data: {
          table_id: i + 1,
          website_id: Number(website?.id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }
  }

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
