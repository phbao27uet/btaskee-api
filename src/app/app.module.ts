import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
