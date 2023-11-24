import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class TrueCountDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  true_count: string;

  @ApiProperty()
  @IsString()
  @Expose()
  evolution_table_id: string;
}
