import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UpdateTrueCountSettingDto } from './dto/update-true-count-setting.dto';
import { TrueCountSettingService } from './true-count-setting.service';

@Controller('admin/true-count')
@ApiTags('admin true count')
export class TrueCountSettingController {
  constructor(private trueCountSettingService: TrueCountSettingService) {}

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get()
  async getTrueCountSetting() {
    return this.trueCountSettingService.getTrueCountSetting();
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Post('update-true-count-setting')
  async updateTrueCountSetting(
    @Body() updateTrueCountSettingDto: UpdateTrueCountSettingDto,
  ) {
    return this.trueCountSettingService.updateTrueCountSetting(
      updateTrueCountSettingDto,
    );
  }

  // @UseGuards(JwtAdminAuthGuard)
  // @ApiBearerAuth('admin-access-token')
  @Get('get-all-true-count')
  async getAllTrueCount(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
  ) {
    return this.trueCountSettingService.getAllTrueCount({
      page: +page,
      perPage: +perPage,
    });
  }
}
