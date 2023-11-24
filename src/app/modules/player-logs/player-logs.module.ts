import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PlayerLogsService } from './player-logs.service';

@Module({
  imports: [PrismaModule],
  providers: [PlayerLogsService],
  exports: [PlayerLogsService],
})
export class PlayerLogsModule {}
