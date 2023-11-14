import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { TrueCountController } from './true-count.controller';
import { TrueCountService } from './true-count.service';

@Module({
  imports: [PrismaModule],
  controllers: [TrueCountController],
  providers: [TrueCountService],
  exports: [TrueCountService],
})
export class TrueCountModule {}
