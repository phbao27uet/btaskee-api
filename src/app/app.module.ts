import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { GameLogsModule } from './modules/game-logs/game-logs.module';
import { PlayerLogsModule } from './modules/player-logs/player-logs.module';
import { TrueCountModule } from './modules/true-count/true-count.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    TrueCountModule,
    FilesModule,
    GameLogsModule,
    PlayerLogsModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
