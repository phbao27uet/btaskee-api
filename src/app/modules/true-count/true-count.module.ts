import { Module } from '@nestjs/common';
import { DiscordModule } from 'src/shared/discord/discord.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { LicensesModule } from '../licenses/licenses.module';
import { TrueCountController } from './true-count.controller';
import { TrueCountService } from './true-count.service';

@Module({
  imports: [PrismaModule, DiscordModule, LicensesModule],
  controllers: [TrueCountController],
  providers: [TrueCountService],
  exports: [TrueCountService],
})
export class TrueCountModule {}
