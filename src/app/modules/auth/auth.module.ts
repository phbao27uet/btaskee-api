import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/shared/mail/mail.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { JWT_CONSTANTS } from 'src/utils/constants';
import { LicensesModule } from '../licenses/licenses.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_CONSTANTS.ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN },
      }),
    }),
    PassportModule,
    PrismaModule,
    MailModule,
    LicensesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
