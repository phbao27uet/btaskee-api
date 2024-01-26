import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { SchedulerResetTrueCountService } from './reset-true-count.service';

@Module({
  imports: [PrismaModule],
  providers: [SchedulerResetTrueCountService],
})
export class SchedulerResetTrueCountModule {}
