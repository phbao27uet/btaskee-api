import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  IRefreshJWT,
  IUserJWT,
} from '../../auth/interfaces/auth-payload.interface';
import { AdminAuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { JwtAdminAuthGuard } from './guards/admin-auth.guard';
import { AdminJwtRefreshStrategy } from './strategies/admin-refresh-token.strategy';

@Controller('admin/auth')
@ApiTags('admin auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.adminAuthService.login(loginDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.adminAuthService.logout(userId);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.adminAuthService.me(userId);
  }

  @UseGuards(AdminJwtRefreshStrategy)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const user = req.user as IRefreshJWT;

    const userId = user.userId;
    const refreshToken = user.refreshToken;

    return this.adminAuthService.refreshToken(userId, refreshToken);
  }
}
