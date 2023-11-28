import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PlayerLogsModule } from '../player-logs/player-logs.module';
import { GameLogsController } from './game-logs.controller';
import { GameLogsService } from './game-logs.service';

@Module({
  imports: [PrismaModule, PlayerLogsModule],
  controllers: [GameLogsController],
  providers: [GameLogsService],
})
export class GameLogsModule {}