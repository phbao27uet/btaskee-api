import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { MaintenanceController } from './controllers/maintenance.controller';
import { RecommendedShoppingMaintenanceController } from './controllers/recommended-shopping-maintenance.controller';
import { RecommendedShoppingController } from './controllers/recommended-shopping.controller';
import { ShoppingController } from './controllers/shopping.controller';
import { MaintenanceService } from './services/maintenance.service';
import { RecommendedShoppingMaintenanceService } from './services/recommended-shopping-maintenance.service';
import { RecommendedShoppingService } from './services/recommended-shopping.service';
import { ShoppingService } from './services/shopping.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    RecommendedShoppingController,
    RecommendedShoppingMaintenanceController,
    ShoppingController,
    MaintenanceController,
  ],
  providers: [
    RecommendedShoppingService,
    RecommendedShoppingMaintenanceService,
    ShoppingService,
    MaintenanceService,
  ],
  exports: [RecommendedShoppingService, RecommendedShoppingMaintenanceService],
})
export class PlanModule {}
