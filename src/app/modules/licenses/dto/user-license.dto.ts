import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLicenseDto {
  @ApiProperty()
  @IsString()
  code: string;
}
