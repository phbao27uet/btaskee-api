import {
  PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
  PAYPAL_AXIOS_INSTANCE_TOKEN,
  PAYPAL_MODULE_OPTIONS,
  PAYPAL_PAYMENT_SERVICE_INSTANCE_TOKEN,
  PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
} from './constants';

import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import axios from 'axios';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import {
  PaypalModuleAsyncOptions,
  PaypalModuleOptions,
  PaypalModuleOptionsFactory,
} from './interfaces';
import { PayPalPaymentController } from './paypal-payment.controller';
import {
  PaypalAuthorizationService,
  PaypalPaymentService,
  PaypalUtilsService,
} from './services';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [PayPalPaymentController],
  providers: [
    PaypalPaymentService,
    PaypalUtilsService,
    PaypalAuthorizationService,
  ],
})
export class PaypalPaymentModule {
  static register(options: PaypalModuleOptions): DynamicModule {
    return {
      module: PaypalPaymentModule,
      providers: [
        {
          provide: PAYPAL_AXIOS_INSTANCE_TOKEN,
          useValue: axios.create(),
        },
        {
          provide: PAYPAL_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: PAYPAL_PAYMENT_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalPaymentService,
        },
        {
          provide: PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalAuthorizationService,
        },
        {
          provide: PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalUtilsService,
        },
      ],
      exports: [
        {
          provide: PAYPAL_PAYMENT_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalPaymentService,
        },
      ],
    };
  }

  static registerAsync(options: PaypalModuleAsyncOptions): DynamicModule {
    return {
      module: PaypalPaymentModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: PAYPAL_AXIOS_INSTANCE_TOKEN,
          useFactory: (_: PaypalModuleOptions) => axios.create(),
          inject: [PAYPAL_MODULE_OPTIONS],
        },
        {
          provide: PAYPAL_PAYMENT_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalPaymentService,
        },
        {
          provide: PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalAuthorizationService,
        },
        {
          provide: PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalUtilsService,
        },
        ...(options.extraProviders || []),
      ],
      exports: [
        {
          provide: PAYPAL_PAYMENT_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalPaymentService,
        },
      ],
    };
  }

  private static createAsyncProviders(
    options: PaypalModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass as any,
        useClass: options.useClass as any,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PaypalModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PAYPAL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: PAYPAL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PaypalModuleOptionsFactory) =>
        optionsFactory.createPaypalModuleOptions(),
      inject: [(options.useExisting as any) || (options.useClass as any)],
    };
  }
}
