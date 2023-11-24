import { Module } from '@nestjs/common';
import { DiscordModule } from 'src/shared/discord/discord.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { TrueCountSettingController } from './true-count-setting.controller';
import { TrueCountSettingService } from './true-count-setting.service';

@Module({
  imports: [PrismaModule, DiscordModule],
  controllers: [TrueCountSettingController],
  providers: [TrueCountSettingService],
  exports: [TrueCountSettingService],
})
export class TrueCountSettingModule {}
