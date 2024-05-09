import { PaypalMoneyDto, PaypalPayeeBaseDto } from '@app/modules/paypal/dtos';

export class PaypalPlatformFeeDto {
  amount: PaypalMoneyDto;
  payee: PaypalPayeeBaseDto;
}
