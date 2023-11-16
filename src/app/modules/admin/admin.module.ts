import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthModule } from './auth/auth.module';

@Module({
  imports: [AdminAuthModule, PassportModule],
})
export class AdminModule {}
