import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(message: string) {
    const url = `https://discord.com/api/webhooks/1176430612945584159/p9X0WRIsKuYphCkI2rbY2VFukXappIoTG-kE3a-sXK3b0N4EDsBJcTDDmyQoYBeWrx9O`;
    await this.httpService.axiosRef.post(url, {
      content: message,
    });
  }
}
