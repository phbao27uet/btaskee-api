import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateLicenseDto {
  @ApiProperty()
  @IsNumber()
  add_days: number;
}
