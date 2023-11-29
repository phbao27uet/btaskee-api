import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { LicensesModule } from './licenses/licenses.module';
import { TrueCountSettingModule } from './true-count-setting/true-count-setting.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AdminAuthModule,
    PassportModule,
    UsersModule,
    TrueCountSettingModule,
    LicensesModule,
    GroupsModule,
  ],
})
export class AdminModule {}
