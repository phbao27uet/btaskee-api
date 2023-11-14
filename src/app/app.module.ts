import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { TrueCountModule } from './modules/true-count/true-count.module';

@Module({
  imports: [AuthModule, TrueCountModule, FilesModule],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
