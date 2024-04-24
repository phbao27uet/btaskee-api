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
import { ManagerService } from "../services/manager.service";

@Controller("category-management")
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  // ---------------------------- MANAGER ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("managers")
  async findAll(
    @Query("page") page = 1,
    @Query("perPage") perPage = 20,
    @Query("id") id?: number,
    @Query("name") name?: string
  ) {
    return this.managerService.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name },
    });
  }

  @Get("managers-workers")
  async findAllManagersWorkers(
    @Query("page") page = 1,
    @Query("perPage") perPage = 20
  ) {
    return this.managerService.findAllManagersWorkers({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("managers/:id")
  async findOn(@Param("id") id: number) {
    return this.managerService.findOne(+id);
  }

  @Post("managers")
  async create(@Body() createDto: any) {
    console.log("createDto", createDto);

    return this.managerService.create(createDto);
  }

  @Patch("managers/:id")
  async update(@Body() updateDto: any, @Param("id") id: number) {
    console.log("id", id);
    console.log("updateDto", updateDto);

    return this.managerService.update(+id, updateDto);
  }

  @Delete("managers/:id")
  async remove(@Param("id") id: number) {
    console.log("id", id);

    return this.managerService.remove(+id);
  }
}
