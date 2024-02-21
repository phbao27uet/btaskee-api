import { Module } from '@nestjs/common';
import { MailModule } from 'src/shared/mail/mail.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
