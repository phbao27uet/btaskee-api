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

  async getRooms() {
    const trueCountSetting = await this.prisma.trueCountSetting.findFirst({});

    if (!trueCountSetting) {
      throw new NotFoundException('True Count Setting not found');
    }

    const tables = await this.prisma.table.findMany({
      where: {
        true_count: {
          gte: trueCountSetting?.true_count,
        },
      },
      select: {
        true_count: true,
        evolution_table_id: true,
        name: true,
      },
      orderBy: {
        true_count: 'desc',
      },
    });

    return tables;
  }

  async getTCTableByName(table_name: string) {
    const tcTable = await this.prisma.table.findFirst({
      where: {
        name: table_name,
      },
      select: {
        id: true,
        name: true,
        evolution_table_id: true,
        true_count: true,
      },
    });

    if (!tcTable) {
      throw new NotFoundException('True Count not found');
    }

    return tcTable;
  }

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
      this.discordService.sendMessage(`Counted > 250: ${table.name}}`);
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

    if (table_id === 'pdk5yzyfjkgepoml') {
      // ブラックジャック VIP 11
      this.discordService.sendMessageTest(
        `True Count table: ${table_id}\ntableName: ${table.name}\ngame_id_db: ${gameId}\ngame_id: ${game_id}\ncards: ${cards}\ndifference: ${difference}\ncountedCards: ${countedCards}\nrunningCount: ${runningCount}\ntrueCount: ${trueCount}\n`,
      );
    }

    this.discordService.sendMessage(
      `【お知らせ】\n【${table.name}】\n【TC ${trueCount.toFixed(
        2,
      )}】\n【出したカード数 ${countedCards}】\n`,
    );

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

    this.discordService.sendMessage(`Reset True Count ${table.name}`);

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
