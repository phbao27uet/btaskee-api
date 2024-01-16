import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/shared/prisma/prisma.service';
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
      throw new NotFoundException('ユーザーが見つかりません');
    }

    const isMatch = await argon2.verify(user?.password, password);

    if (!isMatch) {
      throw new BadRequestException('パスワードが正しくありません.');
    }

    const token = await this.generateToken(user.id, user.name);

    const refreshTokenHashed = await argon2.hash(token.refreshToken);

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
      where: {
        email: registerDto.email,
      },
    });

    const admin = await this.prisma.admin.findUnique({
      where: { email: registerDto.email },
    });

    const existingUser =
      user?.status === 'APPROVED' || user?.status === 'PENDING';

    if (existingUser || admin) {
      throw new BadRequestException('メールアドレスはすでに存在しています');
    }

    const passwordHashed = await argon2.hash(registerDto.password);

    if (user) {
      await this.prisma.user.update({
        where: { email: registerDto.email },
        data: {
          name: registerDto.name,
          furigana: registerDto.furigana,
          email: registerDto.email,
          password: passwordHashed,
          status: 'PENDING',
        },
      });
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          furigana: registerDto.furigana,
          email: registerDto.email,
          password: passwordHashed,
        },
      });

      if (!newUser) {
        throw new BadRequestException('登録に失敗しました');
      }
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
          secret: process.env.ZEN_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ZEN_ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.ZEN_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.ZEN_REFRESH_TOKEN_EXPIRES_IN,
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
      throw new NotFoundException('ユーザーが見つかりません');
    }

    if (!user?.refresh_token) {
      throw new BadRequestException('リフレッシュトークンが正しくありません.');
    }

    const isMatch = await argon2.verify(user?.refresh_token, refreshToken);

    if (!isMatch) {
      throw new BadRequestException('リフレッシュトークンが正しくありません.');
    }

    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.name,
      },
      {
        secret: process.env.ZEN_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ZEN_ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return { accessToken: newAccessToken };
  }
}
