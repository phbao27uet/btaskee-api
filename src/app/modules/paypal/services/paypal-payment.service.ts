import {
  PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
  PAYPAL_AXIOS_INSTANCE_TOKEN,
  PAYPAL_MODULE_OPTIONS,
  PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
} from '@app/modules/paypal/constants';
import {
  AuthorizeOrderHeadersDto,
  CreatePaypalOrderDto,
  InitiateOrderHeadersDto,
  PaypalOrderDto,
} from '@app/modules/paypal/dtos';
import { UpdatePaypalOrderDto } from '@app/modules/paypal/dtos/order/update-paypal-order.dto';
import { PaymentSourceResponseDto } from '@app/modules/paypal/dtos/payment-source-response.dto';
import { PaypalErrorsConstants } from '@app/modules/paypal/errors';
import { PaypalModuleOptions } from '@app/modules/paypal/interfaces';
import {
  PaypalAuthorizationService,
  PaypalUtilsService,
} from '@app/modules/paypal/services';
import { AxiosInstance } from 'axios';

import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PaypalPaymentService {
  constructor(
    @Inject(PAYPAL_AXIOS_INSTANCE_TOKEN)
    private readonly axiosInstance: AxiosInstance,

    @Inject(PAYPAL_MODULE_OPTIONS)
    private readonly options: PaypalModuleOptions,

    @Inject(PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN)
    private paypalAuthorizationService: PaypalAuthorizationService,

    @Inject(PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN)
    private paypalUtilsService: PaypalUtilsService,

    private readonly prismaService: PrismaService,
  ) {}

  async _preparePaypalRequestHeaders(customHeaders?: any) {
    const initiateTokenResponse =
      await this.paypalAuthorizationService.getAccessToken();

    const { access_token } = initiateTokenResponse;
    return {
      'Content-Type': 'application/json',
      Authorization: access_token
        ? `Bearer ${access_token}`
        : `Basic ${this.paypalAuthorizationService.getBasicKey()}`,
      ...customHeaders,
    };
  }

  async initiateOrder(
    taskPayload: {
      task_id: number;
      user_id: number;
    },
    orderPayload: CreatePaypalOrderDto,
    headers?: InitiateOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);

    const apiUrl = this.paypalUtilsService.getApiUrl(
      process.env.PAYPAL_MODE as 'live' | 'sandbox',
    );
    return this.axiosInstance
      .post<PaypalOrderDto>(
        `${apiUrl}/v2/checkout/orders`,
        {
          application_context: {
            return_url: 'http://localhost:3000/return',
            cancel_url: 'http://localhost:3000/cancel',
          },
          ...orderPayload,
        },
        {
          headers: {
            ..._headers,
            'PayPal-Request-Id': taskPayload.task_id.toString(),
            Prefer: 'return=representation',
          },
        },
      )
      .then(async (r) => {
        console.log(r.data);

        const linkApprove = r.data.links.find((link) => link.rel === 'approve');

        console.log('linkApprove', linkApprove);
        console.log({
          order_payment_id: r.data.id,
          order_date: new Date(),
          total_price: 1000,
          order_link: linkApprove?.href as string,
          intent: orderPayload.intent,
          status: r.data.status,
          task_id: taskPayload.task_id,
          user_id: taskPayload.user_id,
        });

        await this.prismaService.order.create({
          data: {
            order_payment_id: r.data.id,
            order_date: new Date(),
            total_price: 1000,
            order_link: linkApprove?.href as string,
            intent: orderPayload.intent,
            status: r.data.status,
            task_id: taskPayload.task_id,
            user_id: taskPayload.user_id,
          },
        });

        return r.data;
      })
      .catch((e) => {
        console.log(e);

        throw {
          ...PaypalErrorsConstants.INITIATE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdatePaypalOrderDto[],
  ): Promise<{ message: string }> {
    const _headers = await this._preparePaypalRequestHeaders();
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .patch(`${apiUrl}/v2/checkout/orders/${orderId}`, updateOrderDto, {
        headers: _headers,
      })
      .then((r) => {
        console.log('Order updated', r);

        if (r.status === 204) {
          return {
            message: `Order updated successfully!`,
          };
        }
        return r.data;
      })
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.UPDATE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }

  async getOrderDetails(orderId: string): Promise<PaypalOrderDto> {
    const headers = await this._preparePaypalRequestHeaders();
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .get(`${apiUrl}/v2/checkout/orders/${orderId}`, {
        headers,
      })
      .then((r) => {
        if (r.status === 200) {
          return r.data;
        }
        throw {
          message: 'Un-expected error',
          data: r.data,
        };
      })
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.GET_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }

  async authorizePaymentForOrder(
    orderId: string,
    payload: PaymentSourceResponseDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);

    return this.axiosInstance
      .post(`${apiUrl}/v2/checkout/orders/${orderId}/authorize`, payload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.AUTHORIZE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }

  async capturePaymentForOrder(
    orderId: string,
    payload: PaymentSourceResponseDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .post<PaypalOrderDto>(
        `${apiUrl}/v2/checkout/orders/${orderId}/capture`,
        payload,
        {
          headers: _headers,
        },
      )
      .then(async (r) => {
        await this.prismaService.payment.create({
          data: {
            payment_date: new Date(),
            amount: r.data.purchase_units[0].amount?.value
              ? +r.data.purchase_units[0].amount?.value
              : 0,
            order_id: +orderId,
          },
        });

        return r.data;
      })
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.CAPTURE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
}
