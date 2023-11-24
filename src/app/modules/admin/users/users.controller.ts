import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { USER_STATUS } from 'src/utils/constants';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
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
  @ApiParam({
    name: 'status',
    required: true,
    description: 'status',
  })
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
    @Query('status') status = USER_STATUS['PENDING'],
  ) {
    return this.usersService.findAll({
      page: +page,
      perPage: +perPage,
      status: status as keyof typeof USER_STATUS,
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
