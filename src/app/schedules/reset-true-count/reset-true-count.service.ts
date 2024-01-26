import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class SchedulerResetTrueCountService {
  private readonly logger = new Logger(SchedulerResetTrueCountService.name);
  constructor(private prismaService: PrismaService) {}

  @Interval(60000 * 15)
  async handleCron() {
    try {
      this.logger.debug('CRON JOB CHECK RESET TRUE COUNT');

      const cntDeathRoom = await this.prismaService.table.count({
        where: {
          is_reset_true_count: false,
          updated_at: {
            lte: new Date(new Date().getTime() - 10 * 60000),
          },
        },
      });

      if (cntDeathRoom) {
        this.logger.error(`HAVE ${cntDeathRoom} ROOM NEED TO RESET TRUE COUNT`);
      }

      await this.prismaService.$transaction([
        this.prismaService.table.updateMany({
          where: {
            is_reset_true_count: false,
            updated_at: {
              lte: new Date(new Date().getTime() - 5 * 60000),
            },
          },
          data: {
            running_count: 0,
            true_count: 0,
            counted_cards: 0,
            is_reset_true_count: false,
          },
        }),
      ]);
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.logger.debug('CRON JOB CHECK RESET TRUE COUNT DONE');

      await this.prismaService.$disconnect();
    }
  }
}
