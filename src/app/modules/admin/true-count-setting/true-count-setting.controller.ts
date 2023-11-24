import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UpdateTrueCountSettingDto } from './dto/update-true-count-setting.dto';
import { TrueCountSettingService } from './true-count-setting.service';

@Controller('admin/true-count')
export class TrueCountSettingController {
  constructor(private trueCountSettingService: TrueCountSettingService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async getTrueCountSetting() {
    return this.trueCountSettingService.getTrueCountSetting();
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('update-true-count-setting')
  async updateTrueCountSetting(
    @Body() updateTrueCountSettingDto: UpdateTrueCountSettingDto,
  ) {
    return this.trueCountSettingService.updateTrueCountSetting(
      updateTrueCountSettingDto,
    );
  }
}
