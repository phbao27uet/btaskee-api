import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscordService } from 'src/shared/discord/discord.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RUNNING_COUNT } from 'src/utils/constants';

@Injectable()
export class TrueCountService {
  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  async calcTrueCount(table_id: string, cards: string[], game_id: string) {
    const table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const gameId = table?.game_id;

    // TODO: If new game id is different from the previous one, reset the last cards
    const lastCards: string[] =
      gameId === game_id && table?.last_cards
        ? JSON.parse(table?.last_cards)
        : [];

    const difference = this.findArrayDifference(lastCards, cards);

    const countedCards =
      Number(table?.counted_cards) + (difference?.length || 0);

    if (countedCards > 250) {
      this.discordService.sendMessage(`Counted > 250: ${table_id}}`);
    }

    const runningCount = difference.reduce(
      (acc, card) => {
        return acc + RUNNING_COUNT[card as keyof typeof RUNNING_COUNT];
      },
      table?.running_count || 0,
    );

    //TODO: trueCount = runningCount / (8 decks - 8 decks/ 416 cards * countedCards)
    // 8 decks = 416 cards

    const trueCount = runningCount / (8 - (8 / 416) * countedCards);

    console.log('True Count table: ', table_id, {
      tableName: table.name,
      game_id_db: gameId,
      game_id,
      cards,
      difference,
      countedCards,
      runningCount,
      trueCount,
    });
    console.log('\n');

    if (table_id === 'ps3t7j4ykfe2fhdw') {
      this.discordService.sendMessage(
        `True Count table: ${table_id}, ${JSON.stringify({
          tableName: table.name,
          cards,
          countedCards,
          runningCount,
          trueCount,
        })}`,
      );
    }

    return await this.prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        game_id: game_id,
        running_count: runningCount,
        true_count: trueCount,
        counted_cards: countedCards,
        last_cards: JSON.stringify(cards),
      },
    });
  }

  async resetTrueCount(table_id: string) {
    const table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    console.log('Reset True Count table: ', table_id);
    console.log('\n');

    if (table_id === 'ps3t7j4ykfe2fhdw') {
      this.discordService.sendMessage(`Reset True Count table: ${table_id}`);
    }

    return await this.prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        running_count: 0,
        true_count: 0,
        counted_cards: 0,
      },
    });
  }

  async resetAllTrueCount() {
    const tables = await this.prisma.table.findMany({});

    for (const table of tables) {
      await this.prisma.table.update({
        where: {
          id: table.id,
        },
        data: {
          running_count: 0,
          true_count: 0,
          counted_cards: 0,
          game_id: null,
          last_cards: null,
        },
      });
    }

    console.log('Reset All True Count');
    console.log('\n');

    this.discordService.sendMessage(`Reset All True Count`);

    return true;
  }

  findArrayDifference(arr1: string[], arr2: string[]) {
    const count1: { [key: string]: number } = {};
    const count2: { [key: string]: number } = {};
    const difference = [];

    for (const item of arr1) {
      count1[item] = (count1[item] || 0) + 1;
    }

    for (const item of arr2) {
      count2[item] = (count2[item] || 0) + 1;
    }

    for (const item in count2) {
      if (count2[item] > (count1[item] || 0)) {
        for (let i = 0; i < count2[item] - (count1[item] || 0); i++) {
          difference.push(item);
        }
      }
    }

    return difference;
  }
}
