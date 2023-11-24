import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGameLogDto {
  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  money_bet: number;

  @ApiProperty({
    example: 200,
  })
  @IsNumber()
  money_returned: number;

  @ApiProperty({
    example: 'pdk52e3rey6upyie',
  })
  @IsString()
  table_id: string;

  @ApiProperty({
    example: 60000,
  })
  @IsNumber()
  balance: number;
}
