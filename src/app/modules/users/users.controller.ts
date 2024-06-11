import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/shared/decorators/get-current-user-id.decorator';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.usersService.create(createDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('analysis')
  analysis(@GetCurrentUserId() userId: number) {
    return this.usersService.applySeeker(userId);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('apply-seeker')
  applySeeker(@GetCurrentUserId() userId: number) {
    return this.usersService.applySeeker(userId);
  }

  @Post('handle-apply-seeker')
  handleApplySeeker(@Body() dto: any) {
    return this.usersService.handleApplySeeker(dto);
  }

  @Get('apply-seeker')
  findAllApplySeeker(@Query('page') page = 1, @Query('perPage') perPage = 20) {
    return this.usersService.findAllApplySeeker({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('condition') condition?: string,
  ) {
    return this.usersService.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name, status, condition },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.usersService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
