import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { JwtAuthRefreshGuard } from './guards/refreshToken.guard';
import { IRefreshJWT, IUserJWT } from './interfaces/auth-payload.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'APP',
  })
  @ApiBody({
    type: LoginDto,
    schema: {
      $ref: getSchemaPath(LoginDto),
    },
  })
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'ADMIN',
  })
  @ApiBody({
    type: RegisterDto,
    schema: {
      $ref: getSchemaPath(RegisterDto),
    },
  })
  async signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'APP',
  })
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'APP',
  })
  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.authService.me(userId);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @ApiOperation({
    summary: 'APP',
  })
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    const user = req.user as IRefreshJWT;

    const userId = user.userId;
    const refreshToken = user.refreshToken;

    return this.authService.refreshToken(userId, refreshToken);
  }
}
