import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CalcTrueCountDto {
  @ApiProperty({
    example: ['2', '3', '4', '5', '6'],
  })
  @IsArray()
  cards: string[];

  @ApiProperty({
    example: '12bca228-c',
  })
  @IsString()
  gameId: string;
}
