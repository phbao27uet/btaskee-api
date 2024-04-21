import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { WorkerService } from "../services/worker.service";

@Controller("category-management")
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  // ---------------------------- WORKERS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("workers")
  async findAlls(@Query("page") page = 1, @Query("perPage") perPage = 20) {
    return this.workerService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("workers/:id")
  async findOne(@Param("id") id: number) {
    return this.workerService.findOne(+id);
  }

  @Post("workers")
  async create(@Body() createDto: any) {
    console.log("createDto", createDto);

    return this.workerService.create(createDto);
  }

  @Patch("workers/:id")
  async update(@Body() updateDto: any, @Param("id") id: number) {
    console.log("id", id);
    console.log("updateDto", updateDto);

    return this.workerService.update(+id, updateDto);
  }

  @Delete("workers/:id")
  async remove(@Param("id") id: number) {
    console.log("id", id);

    return this.workerService.remove(+id);
  }
}
