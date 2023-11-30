import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailApproved(email: string, username: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '【Zenシステム】会員登録が完了いたしました。',
      template: './welcome',
      context: {
        name: username,
      },
    });
  }

  async sendMailWarning(email: string, username: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Warning',
      template: './warning',
      context: {
        name: username,
      },
    });
  }
}
