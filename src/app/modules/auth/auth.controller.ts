import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AdminAuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAdminAuthGuard } from './guards/admin-auth.guard';
import { JwtAdminAuthRefreshGuard } from './guards/admin-refresh-token.guard';
import { IRefreshJWT, IUserJWT } from './interfaces/auth-payload.interface';

@Controller('auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.adminAuthService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.adminAuthService.register(registerDto);
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

  @UseGuards(JwtAdminAuthRefreshGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const user = req.user as IRefreshJWT;

    const userId = user.userId;
    const refreshToken = user.refreshToken;

    return this.adminAuthService.refreshToken(userId, refreshToken);
  }
}
