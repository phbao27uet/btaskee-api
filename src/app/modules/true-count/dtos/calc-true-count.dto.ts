import { IsArray, IsNumber } from 'class-validator';

export class CalcTrueCountDto {
  @IsArray()
  cards: string[];

  @IsNumber()
  countedCards: number;
}
