import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
