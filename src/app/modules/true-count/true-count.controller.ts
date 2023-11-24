import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CalcTrueCountDto } from './dtos/calc-true-count.dto';
import { TrueCountService } from './true-count.service';

@Controller('true-count')
@ApiTags('true-count')
export class TrueCountController {
  constructor(private trueCountService: TrueCountService) {}

  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  @ApiBearerAuth('JWT-auth')
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
    return this.trueCountService.calcTrueCount(
      params?.table_id,
      calcTrueCountDto.cards,
      calcTrueCountDto.gameId,
    );
  }

  @Post('reset-all')
  async resetAllTrueCount() {
    return this.trueCountService.resetAllTrueCount();
  }
}
