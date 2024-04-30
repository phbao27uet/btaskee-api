import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './modules/files/file.module';

import { AssetManagementModule } from './modules/asset-management/asset-management.module';
import { AdminAuthModule } from './modules/auth/auth.module';
import { CategoryManagementModule } from './modules/category-management/category-management.module';
import { PlanModule } from './modules/plan/plan.module';

@Module({
  imports: [
    AdminAuthModule,
    CategoryManagementModule,
    FilesModule,
    PlanModule,
    AssetManagementModule,
    ScheduleModule.forRoot(),
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
