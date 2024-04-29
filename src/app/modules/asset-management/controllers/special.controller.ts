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
import { SpecialService } from '../services/special.service';

@Controller('asset-management')
export class SpecialController {
  constructor(private service: SpecialService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('special')
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

  @Get('special/users')
  async getUsers() {
    return this.service.getUsers();
  }

  @Get('special/:id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post('special')
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Post('special/revoke/:id')
  async revoke(@Param('id') id: number) {
    return this.service.revoke(+id);
  }

  @Patch('special/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.service.update(+id, updateDto);
  }

  @Delete('special/:id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
