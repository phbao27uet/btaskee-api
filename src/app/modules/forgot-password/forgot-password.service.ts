import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { MailService } from 'src/shared/mail/mail.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  async sendMail(sendMailDto: SendMailDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: sendMailDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    let resetPassword = await this.prismaService.resetPassword.findFirst({
      where: {
        email: sendMailDto.email,
      },
    });

    if (!resetPassword) {
      resetPassword = await this.prismaService.resetPassword.create({
        data: {
          email: sendMailDto.email,
          token: randomUUID(),
        },
      });
    }

    if (resetPassword) {
      await this.mailService.sendMailForgotPassword(
        sendMailDto.email,
        user.name,
        resetPassword.token,
      );
    }

    return `Send mail to ${sendMailDto.email} success`;
  }

  async reset(resetPasswordDto: ResetPasswordDto, token: string) {
    const resetPassword = await this.prismaService.resetPassword.findFirst({
      where: {
        token,
      },
    });

    if (!resetPassword) {
      throw new NotFoundException('トークンが見つかりません');
    }

    // 30 minutes
    if (
      new Date().getTime() - resetPassword.created_at.getTime() >
      30 * 60000
    ) {
      await this.prismaService.resetPassword.delete({
        where: {
          id: resetPassword.id,
          token,
        },
      });

      throw new BadRequestException('トークンの有効期限が切れました');
    }

    await this.prismaService.user.update({
      where: {
        email: resetPassword.email,
      },
      data: {
        password: await argon2.hash(resetPasswordDto.password),
      },
    });

    await this.prismaService.resetPassword.delete({
      where: {
        id: resetPassword.id,
      },
    });

    return `This action returns a #${token} gameLog`;
  }
}
