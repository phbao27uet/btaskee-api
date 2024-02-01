import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/file.module';
import { GameLogsModule } from './modules/game-logs/game-logs.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { PlayerLogsModule } from './modules/player-logs/player-logs.module';
import { TrueCountModule } from './modules/true-count/true-count.module';
import { SchedulerResetTrueCountModule } from './schedules/reset-true-count/reset-true-count.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    TrueCountModule,
    GameLogsModule,
    PlayerLogsModule,
    LicensesModule,
    FilesModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('ZEN_MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('ZEN_MAIL_USER'),
            pass: config.get('ZEN_MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('ZEN_MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../..', 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    SchedulerResetTrueCountModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
