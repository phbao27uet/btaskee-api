import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateLicenseQuantityDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNumber()
  number_of_days: number;
}
