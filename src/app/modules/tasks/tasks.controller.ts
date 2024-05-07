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

  @UseGuards(JwtAdminAuthGuard)
  @Get()
  findAll(
    @Req() req: Request,

    @Query('page') page = 1,
    @Query('perPage') perPage = 20,

    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('condition') condition?: string,
  ) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.tasksService.findAll({
      page: +page,
      perPage: +perPage,

      userId,

      filter: { id: Number(id), name, status, condition },
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('mine')
  mine(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
    @Req() req: Request,
  ) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.tasksService.mine({
      userId,
      page: +page,
      perPage: +perPage,
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('recommend')
  recommend() {
    return this.tasksService.recommend();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('apply/:id')
  apply(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.tasksService.apply({
      userId,
      taskId: +id,
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('complete/:id')
  complete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.tasksService.complete({
      userId,
      taskId: +id,
    });
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
