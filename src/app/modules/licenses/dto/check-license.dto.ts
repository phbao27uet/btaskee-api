import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CheckLicenseDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;
}
