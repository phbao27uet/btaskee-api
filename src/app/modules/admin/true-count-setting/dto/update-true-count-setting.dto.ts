import { IsNumber } from 'class-validator';

export class UpdateTrueCountSettingDto {
  @IsNumber()
  true_count: number;
}
