import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PlayerLogsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrCreatePlayerLog(userId: number) {
    const playerLog = await this.prismaService.playerLog.findUnique({
      where: { user_id: userId },
    });
    if (playerLog) {
      return playerLog;
    }
    return this.prismaService.playerLog.create({
      data: { user_id: userId, play_count: 0, play_time: 0 },
    });
  }

  async updatePlayerLog(userId: number, playTime: number, playCount: number) {
    const playerLog = await this.prismaService.playerLog.findUnique({
      where: { user_id: userId },
    });
    if (playerLog) {
      return this.prismaService.playerLog.update({
        where: { user_id: userId },
        data: {
          play_time: playerLog.play_time + playTime,
          play_count: playerLog.play_count + playCount,
        },
      });
    }
    return this.prismaService.playerLog.create({
      data: { user_id: userId, play_count: playCount, play_time: playTime },
    });
  }
}
