import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendMailDto } from './dto/send-mail.dto';
import { ForgotPasswordService } from './forgot-password.service';

@Controller('forgot-password')
@ApiTags('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  sendMail(@Body() sendMailDto: SendMailDto) {
    return this.forgotPasswordService.sendMail(sendMailDto);
  }

  @Put('reset-password/:token')
  reset(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.forgotPasswordService.reset(resetPasswordDto, token);
  }
}
