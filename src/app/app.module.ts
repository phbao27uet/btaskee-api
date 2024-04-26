import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './modules/files/file.module';

import { AdminAuthModule } from './modules/auth/auth.module';
import { CategoryManagementModule } from './modules/category-management/category-management.module';

@Module({
  imports: [
    AdminAuthModule,
    CategoryManagementModule,
    FilesModule,
    ScheduleModule.forRoot(),
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
