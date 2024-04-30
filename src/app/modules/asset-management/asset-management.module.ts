import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { BuildingRentalController } from './controllers/building-rental.controller';
import { LiquidationController } from './controllers/liquidation.controller';
import { SpecialController } from './controllers/special.controller';
import { BuildingRentalService } from './services/building-rental.service';
import { LiquidationService } from './services/liquidation.service';
import { SpecialService } from './services/special.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    LiquidationController,
    SpecialController,
    BuildingRentalController,
  ],
  providers: [LiquidationService, SpecialService, BuildingRentalService],
  exports: [LiquidationService, SpecialService, BuildingRentalService],
})
export class AssetManagementModule {}
