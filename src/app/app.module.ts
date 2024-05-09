import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './configurations';
import { AdminAuthModule } from './modules/auth/auth.module';
import { PaypalPaymentModule } from './modules/paypal/paypal-payment.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configurations],
    }),
    AdminAuthModule,
    TasksModule,
    UsersModule,
    ScheduleModule.forRoot(),
    PaypalPaymentModule.register({
      clientId: process.env.PAYPAL_CLIENT_ID as string,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
      environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live',
    }),
    PaypalPaymentModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: any) => {
        return {
          ...configService.get('paypalModuleInterface'),
        };
      },
    }),
  ],
})
export class AppModule {}
