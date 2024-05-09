import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { IUserJWT } from '../auth/interfaces/auth-payload.interface';
import { PaypalPaymentService } from './services/paypal-payment.service';

@Controller('paypal-payment')
export class PayPalPaymentController {
  constructor(private readonly service: PaypalPaymentService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Post('/create-order')
  createOder(@Req() req: Request, @Body() createDto: any) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.service.initiateOrder(
      {
        task_id: createDto.taskId,
        user_id: userId,
      },
      createDto,
    );
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('/capture-order')
  captureOrder(@Body() captureDto: any) {
    return this.service.capturePaymentForOrder(captureDto.orderId, captureDto);
  }

  @Post('/webhook')
  @HttpCode(200)
  async webhookEvent(@Body() eventData: any): Promise<any> {
    console.log('Paypal webhook event data: ', eventData);

    console.log(eventData.resource.purchase_units);

    return { success: true };
  }
}
