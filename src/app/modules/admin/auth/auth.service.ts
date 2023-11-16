import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JWT_CONSTANTS, SALT_ROUNDS } from 'src/utils/constants';
import { LoginDto } from './dtos/auth.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const admin = await this.prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    const isMatch = bcrypt.compareSync(password, admin?.password);

    if (!isMatch) {
      throw new BadRequestException('Password is incorrect.');
    }

    const token = await this.generateToken(admin.id, admin.name);

    const refreshTokenHashed = await bcrypt.hash(
      token.refreshToken,
      SALT_ROUNDS,
    );

    await this.prisma.admin.update({
      where: { email },
      data: {
        refresh_token: refreshTokenHashed,
      },
    });

    return {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      ...token,
    };
  }

  async logout(userId: number) {
    try {
      await this.prisma.admin.update({
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
      const user = await this.prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async generateToken(adminId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: adminId,
          username,
        },
        {
          secret: JWT_CONSTANTS.ADMIN_ACCESS_TOKEN_SECRET,
          expiresIn: JWT_CONSTANTS.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: adminId,
          username,
        },
        {
          secret: JWT_CONSTANTS.ADMIN_REFRESH_TOKEN_SECRET,
          expiresIn: JWT_CONSTANTS.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(adminId: number, refreshToken: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    if (!admin?.refresh_token) {
      throw new BadRequestException('Refresh token is incorrect.');
    }

    const isMatch = bcrypt.compareSync(refreshToken, admin?.refresh_token);

    if (!isMatch) {
      throw new BadRequestException('Refresh token is incorrect.');
    }

    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: admin.id,
        username: admin.name,
      },
      {
        secret: JWT_CONSTANTS.ADMIN_ACCESS_TOKEN_SECRET,
        expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return { accessToken: newAccessToken };
  }
}
