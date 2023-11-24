import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PlayerLogsService } from '../player-logs/player-logs.service';
import { CreateGameLogDto } from './dto/create-game-log.dto';

@Injectable()
export class GameLogsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly playerLogsService: PlayerLogsService,
  ) {}

  async create(createGameLogDto: CreateGameLogDto, userId: number) {
    const playerLog = await this.playerLogsService.getOrCreatePlayerLog(userId);

    const rptValue =
      (createGameLogDto.money_returned / createGameLogDto.money_bet) * 100;

    const table = await this.prismaService.table.findFirst({
      where: { evolution_table_id: createGameLogDto.table_id },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    await this.playerLogsService.updatePlayerLog(userId, 0, 1);

    return await this.prismaService.gameLog.create({
      data: {
        player_log_id: playerLog.id,
        rtp_value: rptValue,
        balance: createGameLogDto.balance,
        money_bet: createGameLogDto.money_bet,
        money_returned: createGameLogDto.money_returned,
        table_id: Number(table?.id),
      },
    });
  }

  findAll() {
    return `This action returns all gameLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameLog`;
  }
}
