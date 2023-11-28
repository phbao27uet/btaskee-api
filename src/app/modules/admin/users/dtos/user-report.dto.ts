import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UserReportDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  end_date: Date;
}
