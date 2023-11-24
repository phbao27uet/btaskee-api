import { IsNumber, IsString } from 'class-validator';

export class CreateGameLogDto {
  @IsNumber()
  money_bet: number;

  @IsNumber()
  money_returned: number;

  @IsString()
  table_id: string;

  @IsNumber()
  balance: number;
}
