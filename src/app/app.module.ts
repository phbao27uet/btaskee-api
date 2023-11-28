import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
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

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
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
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //   },
  // ],
})
export class AppModule {}
