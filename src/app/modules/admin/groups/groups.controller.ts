import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { GroupsService } from './groups.service';

@Controller('admin/groups')
@ApiTags('admin groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('admin-access-token')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }
}
