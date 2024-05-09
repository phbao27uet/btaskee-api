import {
  PAYPAL_AUTHORIZATION_HEADERS,
  PAYPAL_AXIOS_INSTANCE_TOKEN,
  PAYPAL_MODULE_OPTIONS,
} from '@app/modules/paypal/constants';
import { InitiateTokenResponseDto } from '@app/modules/paypal/dtos';
import { PaypalErrorsConstants } from '@app/modules/paypal/errors';
import { PaypalModuleOptions } from '@app/modules/paypal/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';

@Injectable()
export class PaypalAuthorizationService {
  constructor(
    @Inject(PAYPAL_AXIOS_INSTANCE_TOKEN)
    private readonly axiosInstance: AxiosInstance,
    @Inject(PAYPAL_MODULE_OPTIONS)
    private readonly options: PaypalModuleOptions,
  ) {}

  getBasicKey() {
    console.log({ options: this.options });

    return Buffer.from(
      this.options.clientId + ':' + this.options.clientSecret,
    ).toString('base64');
  }

  async getAccessToken(): Promise<InitiateTokenResponseDto> {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const basicKey = this.getBasicKey();
    const data = 'grant_type=client_credentials';

    try {
      const r = await this.axiosInstance.post(url, data, {
        headers: {
          ...PAYPAL_AUTHORIZATION_HEADERS,
          Authorization: `Basic ${basicKey}`,
        },
      });

      return r.data;
    } catch (e: any) {
      throw {
        ...PaypalErrorsConstants.INVALID_CREDENTIALS,
        nativeError: e?.response?.data || e,
      };
    }
  }
}
