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
import { AssetService } from "./services/asset.service";
import { DepartmentService } from "./services/department.service";
import { SupplierService } from "./services/supplier.service";

@Controller("category-management")
export class CategoryManagementController {
  constructor(
    private assetService: AssetService,
    private supplierService: SupplierService,
    private departmentService: DepartmentService
  ) {}

  // ---------------------------- ASSETS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("assets")
  async findAllAssets(@Query("page") page = 1, @Query("perPage") perPage = 20) {
    return this.assetService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("assets/:id")
  async findOneAsset(@Param("id") id: number) {
    return this.assetService.findOne(+id);
  }

  @Post("assets")
  async createAsset(@Body() createDto: any) {
    console.log("createDto", createDto);

    return this.assetService.create(createDto);
  }

  @Patch("assets/:id")
  async updateAsset(@Body() updateDto: any, @Param("id") id: number) {
    console.log("id", id);
    console.log("updateDto", updateDto);

    return this.assetService.update(+id, updateDto);
  }

  @Delete("assets/:id")
  async removeAsset(@Param("id") id: number) {
    console.log("id", id);

    return this.assetService.remove(+id);
  }

  // ---------------------------- SUPPLIERS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("suppliers")
  async findAllSuppliers(
    @Query("page") page = 1,
    @Query("perPage") perPage = 20
  ) {
    return this.supplierService.findAll({
      page: +page,
      perPage: +perPage,
    });
  }

  @Get("suppliers/:id")
  async findOneSupplier(@Param("id") id: number) {
    return this.supplierService.findOne(+id);
  }

  @Post("suppliers")
  async createSuppliert(@Body() createDto: any) {
    console.log("createDto", createDto);

    return this.supplierService.create(createDto);
  }

  @Patch("suppliers/:id")
  async updateSupplier(@Body() updateDto: any, @Param("id") id: number) {
    return this.supplierService.update(+id, updateDto);
  }

  @Delete("suppliers/:id")
  async removeSupplier(@Param("id") id: number) {
    return this.supplierService.remove(+id);
  }

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
