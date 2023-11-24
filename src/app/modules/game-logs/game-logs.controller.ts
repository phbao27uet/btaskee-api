import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { IUserJWT } from '../auth/interfaces/auth-payload.interface';
import { CreateGameLogDto } from './dto/create-game-log.dto';
import { GameLogsService } from './game-logs.service';

@Controller('game-logs')
export class GameLogsController {
  constructor(private readonly gameLogsService: GameLogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createGameLogDto: CreateGameLogDto) {
    const user = req.user as IUserJWT;
    const userId = user.userId;

    return this.gameLogsService.create(createGameLogDto, userId);
  }

  @Get()
  findAll() {
    return this.gameLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameLogsService.findOne(+id);
  }
}
