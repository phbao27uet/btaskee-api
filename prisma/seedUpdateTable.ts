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
      table_limit: room.table_limit,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
};

async function main() {
  generateTables().forEach(async (table, index) => {
    console.log('table', table);

    await prisma.table.update({
      where: {
        id: index + 1,
      },
      data: {
        table_limit: table.table_limit,
      },
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
