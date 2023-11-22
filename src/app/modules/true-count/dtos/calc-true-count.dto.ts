import { IsArray, IsString } from 'class-validator';

export class CalcTrueCountDto {
  @IsArray()
  cards: string[];

  @IsString()
  gameId: string;
}
