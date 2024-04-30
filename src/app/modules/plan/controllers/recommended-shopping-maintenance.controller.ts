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
import { RecommendedShoppingMaintenanceService } from '../services/recommended-shopping-maintenance.service';

@Controller('plan')
export class RecommendedShoppingMaintenanceController {
  constructor(
    private recommendedShoppingService: RecommendedShoppingMaintenanceService,
  ) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get('recommended-shopping-maintenance')
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

  @Get('recommended-shopping-maintenance/:id')
  async findOne(@Param('id') id: number) {
    return this.recommendedShoppingService.findOne(+id);
  }

  @Post('recommended-shopping-maintenance')
  async create(@Body() createDto: any) {
    return this.recommendedShoppingService.create(createDto);
  }

  @Patch('recommended-shopping-maintenance/:id/status')
  async updateStatus(@Body() updateDto: any, @Param('id') id: number) {
    return this.recommendedShoppingService.updateStatus(+id, updateDto);
  }

  @Patch('recommended-shopping-maintenance/:id')
  async update(@Body() updateDto: any, @Param('id') id: number) {
    return this.recommendedShoppingService.update(+id, updateDto);
  }

  @Delete('recommended-shopping-maintenance/:id')
  async remove(@Param('id') id: number) {
    return this.recommendedShoppingService.remove(+id);
  }
}
