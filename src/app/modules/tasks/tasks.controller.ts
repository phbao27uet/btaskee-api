import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { IUserJWT } from '../auth/interfaces/auth-payload.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createTaskDto: any) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.tasksService.create(userId, createTaskDto);
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
    return this.tasksService.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name, status, condition },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
