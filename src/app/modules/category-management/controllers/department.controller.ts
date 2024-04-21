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
import { DepartmentService } from "../services/department.service";

@Controller("category-management")
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  // ---------------------------- DEPARTMENT ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("departments")
  async findAllDepartments(
    @Query("page") page = 1,
    @Query("perPage") perPage = 20
  ) {
    return this.departmentService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("departments/:id")
  async findOneDepartment(@Param("id") id: number) {
    return this.departmentService.findOne(+id);
  }

  @Post("departments")
  async createDepartment(@Body() createDto: any) {
    console.log("createDto", createDto);

    return this.departmentService.create(createDto);
  }

  @Patch("departments/:id")
  async updateDepartment(@Body() updateDto: any, @Param("id") id: number) {
    console.log("id", id);
    console.log("updateDto", updateDto);

    return this.departmentService.update(+id, updateDto);
  }

  @Delete("departments/:id")
  async removeDepartment(@Param("id") id: number) {
    console.log("id", id);

    return this.departmentService.remove(+id);
  }
}
