import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { LiquidationController } from './controllers/liquidation.controller';
import { SpecialController } from './controllers/special.controller';
import { LiquidationService } from './services/liquidation.service';
import { SpecialService } from './services/special.service';

@Module({
  imports: [PrismaModule],
  controllers: [LiquidationController, SpecialController],
  providers: [LiquidationService, SpecialService],
  exports: [LiquidationService, SpecialService],
})
export class AssetManagementModule {}
