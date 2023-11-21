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

  async calcTrueCount(table_id: string, cards: string[], countedCards: number) {
    if (countedCards > 250) {
      throw new NotFoundException('Counted cards cannot be greater than 250');
    }

    const table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const runningCount = cards.reduce(
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
      cards,
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
        running_count: runningCount,
        true_count: trueCount,
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
      },
    });
  }
}
