import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SALT_ROUNDS } from 'src/utils/constants';
import { LicensesService } from '../licenses/licenses.service';
import { LoginDto } from './dtos/auth.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private licensesService: LicensesService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        status: {
          equals: 'APPROVED',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = bcrypt.compareSync(password, user?.password);

    if (!isMatch) {
      throw new BadRequestException('Password is incorrect.');
    }

    const token = await this.generateToken(user.id, user.name);

    const refreshTokenHashed = await bcrypt.hash(
      token.refreshToken,
      SALT_ROUNDS,
    );

    await this.prisma.user.update({
      where: { email },
      data: {
        refresh_token: refreshTokenHashed,
      },
    });

    const license = await this.licensesService.getCurrentLicense(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      license: license,
      ...token,
    };
  }

  async signUp(registerDto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    const admin = await this.prisma.admin.findUnique({
      where: { email: registerDto.email },
    });

    if (user || admin) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHashed = await bcrypt.hash(registerDto.password, SALT_ROUNDS);

    const newUser = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        furigana: registerDto.furigana,
        email: registerDto.email,
        password: passwordHashed,
      },
    });

    if (!newUser) {
      throw new BadRequestException('Register failed');
    }

    return true;
  }

  async logout(userId: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refresh_token: null },
      });

      return { message: 'Logout successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async me(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const license = await this.licensesService.getCurrentLicense(userId);

      return { ...user, license: license };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async generateToken(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user?.refresh_token) {
      throw new BadRequestException('Refresh token is incorrect.');
    }

    const isMatch = bcrypt.compareSync(refreshToken, user?.refresh_token);

    if (!isMatch) {
      throw new BadRequestException('Refresh token is incorrect.');
    }

    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.name,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return { accessToken: newAccessToken };
  }
}
