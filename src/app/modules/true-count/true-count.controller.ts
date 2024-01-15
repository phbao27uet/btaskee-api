import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CalcTrueCountDto } from './dtos/calc-true-count.dto';
import { TrueCountService } from './true-count.service';

@Controller('true-count')
@ApiTags('true-count')
export class TrueCountController {
  constructor(private trueCountService: TrueCountService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('rooms')
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'APP',
    description: 'Get the list of rooms that satisfy the true count condition',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      example: [
        {
          true_count: 2.943396226415095,
          evolution_table_id: 'pdk52e3rey6upyie',
        },
      ],
    },
  })
  async getRooms() {
    return this.trueCountService.getRooms();
  }

  @Put('/flag-reset/:table_id')
  async flagResetTrueCount(@Param() params: any) {
    return this.trueCountService.flagResetTrueCount(params?.table_id);
  }

  @Put('/reset/:table_id')
  async resetTrueCount(@Param() params: any) {
    return this.trueCountService.resetTrueCount(params?.table_id);
  }

  @Put('/:table_id')
  @ApiOperation({
    summary: 'EXTENSION',
  })
  @ApiParam({
    name: 'table_id',
    type: 'string',
    required: true,
  })
  @ApiBody({
    type: CalcTrueCountDto,
    schema: {
      $ref: getSchemaPath(CalcTrueCountDto),
    },
  })
  async calcTrueCount(
    @Param() params: any,
    @Body() calcTrueCountDto: CalcTrueCountDto,
  ) {
    return await this.trueCountService.calcTrueCount(
      params?.table_id,
      calcTrueCountDto.cards,
      calcTrueCountDto.gameId,
    );
  }

  @Get('by-name/:table_name')
  @ApiOperation({
    summary: 'EXTENSION',
  })
  @ApiParam({
    name: 'table_name',
    type: 'string',
    required: true,
  })
  async getTCTableByName(@Param() params: any) {
    return this.trueCountService.getTCTableByName(params?.table_name);
  }

  @Post('reset-all')
  async resetAllTrueCount() {
    return this.trueCountService.resetAllTrueCount();
  }
}
