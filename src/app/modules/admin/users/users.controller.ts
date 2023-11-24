import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UsersService } from './users.service';

@Controller('admin/users')
@ApiTags('admin users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get()
  @ApiParam({
    name: 'page',
    required: false,
    description: 'page',
  })
  @ApiParam({
    name: 'perPage',
    required: false,
    description: 'perPage',
  })
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 20) {
    return this.usersService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
