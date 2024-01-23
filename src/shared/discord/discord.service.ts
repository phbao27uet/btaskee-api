import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(message: string) {
    try {
      const url = `https://discord.com/api/webhooks/1176430612945584159/p9X0WRIsKuYphCkI2rbY2VFukXappIoTG-kE3a-sXK3b0N4EDsBJcTDDmyQoYBeWrx9O`;
      await this.httpService.axiosRef.post(url, {
        content: message,
      });
    } catch (e) {
      console.log('sendMessage Error', e);
    }
  }

  async sendMessageTest(message: string) {
    try {
      const url = `https://discord.com/api/webhooks/1193869092269072406/sYrMu9icY4I-tnI1sWOPWBn41Lzu5iZmPrKQ5rw0DK7Lhw3D75zWC0_qBBJfFZbJ5yc-`;
      await this.httpService.axiosRef.post(url, {
        content: message,
      });
    } catch (e) {
      console.log('sendMessageTest Error', e);
    }
  }

  async sendMessageWithUrl(message: string, url: string) {
    try {
      await this.httpService.axiosRef.post(url, {
        content: message,
      });
    } catch (e) {
      console.log('sendMessageWithUrl Error', e);
    }
  }
}
