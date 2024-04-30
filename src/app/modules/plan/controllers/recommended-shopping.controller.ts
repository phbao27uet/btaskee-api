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
import { RecommendedShoppingService } from '../services/recommended-shopping.service';

@Controller('plan')
export class RecommendedShoppingController {
  constructor(private recommendedShoppingService: RecommendedShoppingService) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('recommended-shopping')
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('implemention_date') implemention_date?: string,
    @Query('petition_date') petition_date?: string,
    @Query('department_id') department_id?: number,
  ) {
    return this.recommendedShoppingService.findAll({
      page: +page,
      perPage: +perPage,
      filter: {
        id: Number(id),
        implemention_date,
        petition_date,
        department_id: Number(department_id),
      },
    });
  }

  @Get('recommended-shopping/:id')
  async findOne(@Param('id') id: number) {
    return this.recommendedShoppingService.findOne(+id);
  }

  @Post('recommended-shopping')
  async create(@Body() createDto: any) {
    return this.recommendedShoppingService.create(createDto);
  }

  @Patch('recommended-shopping/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.recommendedShoppingService.update(+id, updateDto);
  }

  @Patch('recommended-shopping/:id/status')
  async updateStatus(@Body() updateDto: any, @Param('id') id: number) {
    return this.recommendedShoppingService.updateStatus(+id, updateDto);
  }

  @Delete('recommended-shopping/:id')
  async remove(@Param('id') id: number) {
    return this.recommendedShoppingService.remove(+id);
  }
}
