import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { LiquidationController } from './controllers/liquidation.controller';
import { LiquidationService } from './services/liquidation.service';

@Module({
  imports: [PrismaModule],
  controllers: [LiquidationController],
  providers: [LiquidationService],
  exports: [LiquidationService],
})
export class AssetManagementModule {}
