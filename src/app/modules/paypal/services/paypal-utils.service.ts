import { Injectable } from '@nestjs/common';
@Injectable()
export class PaypalUtilsService {
  constructor() {}

  getApiUrl(environment: 'live' | 'sandbox') {
    return environment === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }
}
