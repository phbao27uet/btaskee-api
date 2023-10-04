import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { JwtAuthRefreshGuard } from './guards/refreshToken.guard';
import { IRefreshJWT, IUserJWT } from './interfaces/auth-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.authService.me(userId);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const user = req.user as IRefreshJWT;

    const userId = user.userId;
    const refreshToken = user.refreshToken;

    return this.authService.refreshToken(userId, refreshToken);
  }
}
