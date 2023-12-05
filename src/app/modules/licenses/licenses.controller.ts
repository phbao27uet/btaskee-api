import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { IUserJWT } from '../auth/interfaces/auth-payload.interface';
import { CheckLicenseDto } from './dto/check-license.dto';
import { UserLicenseDto } from './dto/user-license.dto';
import { LicensesService } from './licenses.service';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'APP',
  })
  @Post('')
  create(@Body() userLicenseDto: UserLicenseDto, @Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.licensesService.create(userLicenseDto, userId);
  }

  @Post('check')
  checkLicense(@Body() checkLicenseDto: CheckLicenseDto) {
    return this.licensesService.checkLicense(checkLicenseDto);
  }
}
