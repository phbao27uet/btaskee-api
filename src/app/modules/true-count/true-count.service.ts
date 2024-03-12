import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MWebsite } from '@prisma/client';
import { DiscordService } from 'src/shared/discord/discord.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  RUNNING_COUNT,
  WEBHOOKS_DISCORD,
  WEBHOOKS_DISCORDS,
  WEBHOOKS_DISCORD_1,
  WEBHOOKS_DISCORD_2,
  WEBHOOKS_DISCORD_3,
} from 'src/utils/constants';

@Injectable()
export class TrueCountService {
  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  private readonly logger = new Logger(TrueCountService.name);

  async getRooms(
    website_name: string,
    tc: number | null,
    min_money: number | null,
  ) {
    if (tc === null) {
      const trueCountSetting = await this.prisma.trueCountSetting.findFirst({});

      if (!trueCountSetting) {
        throw new NotFoundException('True Count Setting not found');
      }

      tc = trueCountSetting.true_count;
    }

    let website: MWebsite | null = null;

    if (website_name) {
      website = await this.prisma.mWebsite.findFirst({
        where: {
          name: website_name,
        },
      });

      if (!website) {
        throw new NotFoundException('Website not found');
      }
    }

    const tables = await this.prisma.table.findMany({
      where: {
        true_count: {
          gte: +tc,
        },
        table_limit: {
          lte: Number(min_money) || 999999,
        },
        is_reset_true_count: false,
        is_reset_by_max_card: false,
        is_reset_by_inactivity: false,
        WebsiteTable: {
          some: {
            website_id: website?.id || undefined,
          },
        },
      },
      select: {
        true_count: true,
        evolution_table_id: true,
        name: true,
        table_limit: true,
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
    let table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
      include: {
        WebsiteTable: {
          select: {
            website: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const websitesName = table?.WebsiteTable.map((wt) => wt?.website?.name)
      .filter((w) => !!w)
      .join(', ');

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const gameId = table?.game_id;

    if (table?.is_reset_true_count && game_id != gameId) {
      await this.resetTrueCount({
        table_id,
        isMaxCard: Number(table?.counted_cards) < 170,
      });

      table = await this.prisma.table.findFirst({
        where: {
          evolution_table_id: table_id,
        },
        include: {
          WebsiteTable: {
            select: {
              website: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    if (
      game_id != gameId &&
      !table?.is_reset_by_max_card &&
      !table?.is_reset_by_inactivity
    ) {
      const tcFixed = table?.true_count.toFixed(2);

      // await this.discordService.sendMessage(
      //   `--------\n【お知らせ】\n【${table?.name}】\n【TC ${tcFixed}】\n【出したカード数 ${table?.counted_cards}】\n--------`,
      // );

      // const index = Math.floor((Number(table?.id) - 1) / 70);

      // console.log('index: ', index);
      // console.log('WEBHOOKS_DISCORDS: ', WEBHOOKS_DISCORDS[index]);

      // const webhooksURL = WEBHOOKS_DISCORDS[0];

      await this.sendLogTrueCount(
        Number(table?.true_count),
        `【${table?.name}】\n【TC ${tcFixed}】\n【出したカード数 ${table?.counted_cards}】\n【Webサイト：${websitesName}】\n------------`,
      );
    }

    // TODO: If new game id is different from the previous one, reset the last cards
    const lastCards: string[] =
      gameId === game_id && table?.last_cards
        ? JSON.parse(table?.last_cards)
        : [];

    const difference = this.findArrayDifference(lastCards, cards);

    const countedCards =
      Number(table?.counted_cards) + (difference?.length || 0);

    if (countedCards > 250) {
      await this.discordService.sendMessage(
        `Counted > 250: ${table?.name} ${table_id}`,
      );

      this.logger.error(`Counted > 250: ${table?.name} ${table_id}`);

      return await this.resetTrueCount({ table_id, isMaxCard: true });
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

    // console.log('True Count table: ', table_id, {
    //   tableName: table?.name,
    //   game_id_db: gameId,
    //   game_id,
    //   cards,
    //   difference,
    //   countedCards,
    //   runningCount,
    //   trueCount,
    // });
    // console.log('\n');

    // if (table_id === 'qrtudgalsq5e6jaq' && !table?.is_reset_by_inactivity) {
    //   // Stake エクスクルーシブ ブラックジャック 13
    //   this.discordService.sendMessageTest(
    //     // `--------\nTrue Count table: ${table_id}\ntableName: ${table?.name}\ngame_id_db: ${gameId}\ngame_id: ${game_id}\ncards: ${cards}\ndifference: ${difference}\ncountedCards: ${countedCards}\nrunningCount: ${runningCount}\ntrueCount: ${trueCount}\n`,
    //     `table name: ${table?.name}\ncards: ${cards}\ndifference: ${difference}\ncounted cards: ${countedCards}\nrunning count: ${runningCount}\nTC: ${trueCount}\n------------`,
    //   );
    // }

    return await this.prisma.table.update({
      where: {
        id: table?.id,
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

  async flagResetTrueCount(table_id: string) {
    const table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // last_reset_true_count < now() - 8 minutes
    if (
      table.last_reset_true_count &&
      table.last_reset_true_count > new Date(new Date().getTime() - 8 * 60000)
    ) {
      this.logger.error(
        `Reset True Count too fast ${table?.name}, counted cards: ${table?.counted_cards}`,
      );

      throw new BadRequestException('Reset True Count too fast');
    }

    // if (
    //   Number(table?.counted_cards) <= 180 &&
    //   !table.is_reset_by_inactivity &&
    //   !table.is_reset_by_max_card
    // ) {
    //   this.logger.error(
    //     `Reset True Count too fast < 180 ${table?.name}, counted cards: ${table?.counted_cards}, is_reset_by_inactivity: ${table?.is_reset_by_inactivity}, is_reset_by_max_card: ${table?.is_reset_by_max_card}`,
    //   );

    //   throw new BadRequestException('Reset True Count too fast');
    // }

    this.discordService.sendMessage(
      `Flag Reset True Count table ${table?.name}, counted cards: ${table?.counted_cards}, is_reset_by_inactivity: ${table?.is_reset_by_inactivity}, is_reset_by_max_card: ${table?.is_reset_by_max_card}`,
    );

    return await this.prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        is_reset_true_count: true,
      },
    });
  }

  async resetTrueCount({
    table_id,
    isSendDiscord = true,
    isMaxCard = false,
  }: {
    table_id: string;
    isSendDiscord?: boolean;
    isMaxCard?: boolean;
  }) {
    const table = await this.prisma.table.findFirst({
      where: {
        evolution_table_id: table_id,
      },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // console.log('Reset True Count table: ', table_id);
    // console.log('\n');

    if (isSendDiscord) {
      this.discordService.sendMessage(`Reset True Count ${table.name}`);
    }

    // if (table_id === 'qrtudgalsq5e6jaq') {
    //   // Stake エクスクルーシブ ブラックジャック 13
    //   this.discordService.sendMessageTest(`Reset True Count ${table.name}`);
    // }

    return await this.prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        running_count: 0,
        true_count: 0,
        counted_cards: 0,
        is_reset_true_count: false,
        last_reset_true_count: new Date(),
        is_reset_by_max_card: isMaxCard,
        is_reset_by_inactivity: false,
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
          is_reset_true_count: false,
          last_reset_true_count: null,
          is_reset_by_max_card: false,
          is_reset_by_inactivity: true,
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

  renderWebhookUrl(table_id: string) {
    switch (table_id) {
      case 'ptapzv62p6tekfs4':
      case 'ptaqgzf5p6tek5ai':
      case 'ptaqlecc2xweluwn':
      case 'ptap6zenp6tekovf':
      case 'p6l4vqinplnwhq7s':

      case 'ptaqex6invsulpjo':
      case 'p6l5ih3woizwjwol':
      case 'qrtudgalsq5e6jaq':
      case 'qrtuegzsbmze573z':
      case 'ptaprmkn2xwekgpx':
        return WEBHOOKS_DISCORD;

      case 'mwplwfiltheqikui':
      case 'mqi5d7vvfqcatumk':
      case 'mqi5dhhhfqcatul4':
      case 'ndefqa2tofgqoa3e':
      case 'ndeftrg3ofgqoa6g':

      case 'nep224c3xecqyyl4':
      case 'ngx7r4osoqhqyen2':
      case 'nhrk6zuazggqejda':
      case 'o4k5p7hqpwqq7n5v':
      case 'nxh356xegcllxgmt':
        return WEBHOOKS_DISCORD_1;

      case 'nhrld2edzggqejgp':
      case 'njmogybuwxuad46n':
      case 'njmozz5iwxuad5mn':
      case 'njmoz6m3wxuad5mv':
      case 'nl7mhvp3y4xar4kn':

      case 'nl7mgk3hy4xar3ji':
      case 'nohedgkjiypk7zja':
      case 'nohegqjsiypk73ov':
      case 'nohej3hriypk75yk':
      case 'nrgrpgppsbsdh2s6':
        return WEBHOOKS_DISCORD_2;

      case 'nrgrpmxusbsdh2wt':
      case 'nu4sg4ofmn6jgv46':
      case 'nvzbk5oh6teux5kg':
      case 'nvzbpog76teuybs7':
      case 'nvzbs4f46teuyeu6':
        return WEBHOOKS_DISCORD_3;
    }
  }

  async sendLogTrueCount(tc: number, message: string) {
    switch (true) {
      case tc < 0:
        // WEBHOOKS_DISCORDS.forEach(async (webhook) => {
        //   await this.discordService.sendMessageWithUrl(
        //     message,
        //     webhook['DISCORD_0'] as string,
        //   );
        // });
        break;
      case tc >= 0 && tc < 1:
        // WEBHOOKS_DISCORDS.forEach(async (webhook) => {
        //   await this.discordService.sendMessageWithUrl(
        //     message,
        //     webhook['DISCORD_0_1'] as string,
        //   );
        // });
        break;
      case tc >= 1 && tc < 2:
        // WEBHOOKS_DISCORDS.forEach(async (webhook) => {
        //   await this.discordService.sendMessageWithUrl(
        //     message,
        //     webhook['DISCORD_1_2'] as string,
        //   );
        // });
        break;
      case tc >= 2 && tc < 3:
        WEBHOOKS_DISCORDS.forEach(async (webhook) => {
          await this.discordService.sendMessageWithUrl(
            message,
            webhook['DISCORD_2_3'] as string,
          );
        });

        break;
      case tc >= 3 && tc < 4:
        WEBHOOKS_DISCORDS.forEach(async (webhook) => {
          await this.discordService.sendMessageWithUrl(
            message,
            webhook['DISCORD_3_4'] as string,
          );
        });

        break;
      case tc >= 4 && tc < 5:
        WEBHOOKS_DISCORDS.forEach(async (webhook) => {
          await this.discordService.sendMessageWithUrl(
            message,
            webhook['DISCORD_4_5'] as string,
          );
        });

        break;
      case tc >= 5 && tc < 6:
        WEBHOOKS_DISCORDS.forEach(async (webhook) => {
          await this.discordService.sendMessageWithUrl(
            message,
            webhook['DISCORD_5_6'] as string,
          );
        });

        break;
      case tc >= 6:
        WEBHOOKS_DISCORDS.forEach(async (webhook) => {
          await this.discordService.sendMessageWithUrl(
            message,
            webhook['DISCORD_6'] as string,
          );
        });

        break;
    }
  }
}
