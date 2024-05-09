import {
  PaypalOperationDto,
  PaypalPayerDto,
  PurchaseUnitRequestDto,
} from '@app/modules/paypal/dtos';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class AllowedValueToPatchOrderDto {
  @IsOptional()
  intent?: 'CAPTURE' | 'AUTHORIZE';

  @IsOptional()
  payer?: PaypalPayerDto;

  @IsArray()
  @IsOptional()
  purchase_units?: PurchaseUnitRequestDto[];
}
export class UpdatePaypalOrderDto {
  @IsNotEmpty()
  op: PaypalOperationDto;

  @IsOptional()
  path?: string;

  @IsOptional()
  value?: any;

  @IsOptional()
  from?: string;
}
