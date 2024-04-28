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
import { ShoppingService } from '../services/shopping.service';

@Controller('plan')
export class MaintenanceController {
  constructor(private service: ShoppingService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('maintenance')
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('condition') condition?: string,
  ) {
    return this.service.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name, status, condition },
    });
  }

  @Get('maintenance/:id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post('maintenance')
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Patch('maintenance/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.service.update(+id, updateDto);
  }

  @Delete('maintenance/:id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
