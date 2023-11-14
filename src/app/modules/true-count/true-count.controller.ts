import { Body, Controller, Param, Put } from '@nestjs/common';
import { CalcTrueCountDto } from './dtos/calc-true-count.dto';
import { TrueCountService } from './true-count.service';

@Controller('true-count')
export class TrueCountController {
  constructor(private trueCountService: TrueCountService) {}

  @Put('/reset/:table_id')
  async resetTrueCount(@Param() params: any) {
    return this.trueCountService.resetTrueCount(params?.table_id);
  }

  @Put('/:table_id')
  async calcTrueCount(
    @Param() params: any,
    @Body() calcTrueCountDto: CalcTrueCountDto,
  ) {
    return this.trueCountService.calcTrueCount(
      params?.table_id,
      calcTrueCountDto.cards,
      calcTrueCountDto.countedCards,
    );
  }
}
