import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateTrueCountSettingDto } from './dto/update-true-count-setting.dto';

@Injectable()
export class TrueCountSettingService {
  constructor(private prisma: PrismaService) {}

  async getTrueCountSetting() {
    return await this.prisma.trueCountSetting.findUnique({
      where: {
        id: 1,
      },
    });
  }

  async updateTrueCountSetting(
    updateTrueCountSettingDto: UpdateTrueCountSettingDto,
  ) {
    return await this.prisma.trueCountSetting.update({
      where: {
        id: 1,
      },
      data: {
        true_count: updateTrueCountSettingDto.true_count,
      },
    });
  }
}
