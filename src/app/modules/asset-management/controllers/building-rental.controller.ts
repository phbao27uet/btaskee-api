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
import { BuildingRentalService } from '../services/building-rental.service';

@Controller('asset-management')
export class BuildingRentalController {
  constructor(private service: BuildingRentalService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('building-rental')
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('name') name?: string,
  ) {
    return this.service.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name },
    });
  }

  @Get('building-rental/users')
  async getUsers() {
    return this.service.getUsers();
  }

  @Get('building-rental/:id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post('building-rental')
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Patch('building-rental/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.service.update(+id, updateDto);
  }

  @Delete('building-rental/:id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
