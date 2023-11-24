import { Module } from '@nestjs/common';
import { DiscordModule } from 'src/shared/discord/discord.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, DiscordModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
