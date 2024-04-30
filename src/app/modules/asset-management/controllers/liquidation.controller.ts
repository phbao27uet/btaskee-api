import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LiquidationService } from '../services/liquidation.service';

@Controller('asset-management')
export class LiquidationController {
  constructor(private service: LiquidationService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('liquidation')
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('implemention_date') implemention_date?: string,
    @Query('petition_date') petition_date?: string,
  ) {
    return this.service.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), implemention_date, petition_date },
    });
  }

  @Get('liquidation/:id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post('liquidation')
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Patch('liquidation/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.service.update(+id, updateDto);
  }

  @Delete('liquidation/:id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
