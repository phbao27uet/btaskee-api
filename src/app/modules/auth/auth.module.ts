import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { JWT_CONSTANTS } from 'src/utils/constants';
import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { AdminJwtRefreshStrategy } from './strategies/admin-refresh-token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_CONSTANTS.ADMIN_ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: JWT_CONSTANTS.ADMIN_ACCESS_TOKEN_EXPIRES_IN },
      }),
    }),
    PrismaModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtStrategy, AdminJwtRefreshStrategy],
})
export class AdminAuthModule {}
