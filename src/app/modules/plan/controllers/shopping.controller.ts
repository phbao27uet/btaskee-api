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
export class ShoppingController {
  constructor(private service: ShoppingService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('shopping')
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
      filter: {
        id: Number(id),
        implemention_date,
        petition_date,
      },
    });
  }

  @Get('shopping/:id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post('shopping')
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Patch('shopping/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.service.update(+id, updateDto);
  }

  @Delete('shopping/:id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
