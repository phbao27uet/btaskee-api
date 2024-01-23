/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { WEBSITES } from '@utils/constants';
import { BC_ROOMS } from 'src/websites/bc';
import { BIT_CASINO_ROOMS } from 'src/websites/bit-casino';
import { BONS_ROOMS } from 'src/websites/bons';
import { ELDOAH_ROOMS } from 'src/websites/eldoah';
import { STAKE_ROOMS } from 'src/websites/stake';
import { TEDBET_ROOMS } from 'src/websites/tedbet';
import { TOTAL_ROOM } from 'src/websites/total-room';

const prisma = new PrismaClient();

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

  if (isBelongTo(room.id, TEDBET_ROOMS)) {
    platforms.push(WEBSITES['TED_BET']);
  }

  if (isBelongTo(room.id, BIT_CASINO_ROOMS)) {
    platforms.push(WEBSITES['Bit_Casino']);
  }

  if (isBelongTo(room.id, BONS_ROOMS)) {
    platforms.push(WEBSITES['Bit_Casino']);
  }

  if (isBelongTo(room.id, TEDBET_ROOMS)) {
    platforms.push(WEBSITES['TED_BET']);
  }

  if (platforms.length) {
  }

  return { ...room, platforms };
});

const generateTables = () => {
  console.log('rooms', rooms);

  return rooms.map((room) => {
    return {
      name: room.name,
      true_count: 0,
      running_count: 0,
      evolution_table_id: room.id,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
};

async function main() {
  await prisma.table.createMany({
    data: generateTables(),
    skipDuplicates: true,
  });

  rooms.forEach(async (room, index) => {
    if (!room.platforms.length) {
      return;
    }

    room.platforms.forEach(async (platform) => {
      const website = await prisma.mWebsite.findFirst({
        where: {
          name: platform,
        },
      });

      await prisma.websiteTable.create({
        data: {
          table_id: index + 1,
          website_id: Number(website?.id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    });
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
