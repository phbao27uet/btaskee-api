import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AdminAuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AdminAuthModule,
    TasksModule,
    UsersModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
