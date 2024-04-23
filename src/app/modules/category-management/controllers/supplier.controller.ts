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
import { SupplierService } from "../services/supplier.service";

@Controller("category-management")
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  // ---------------------------- SUPPLIERS ----------------------------
  // @UseGuards(JwtAuthGuard)
  @Get("suppliers")
  async findAllSuppliers(
    @Query("page") page = 1,
    @Query("perPage") perPage = 20,
    @Query("id") id?: number,
    @Query("name") name?: string
  ) {
    return this.supplierService.findAll({
      page: +page,
      perPage: +perPage,
      filter: { id: Number(id), name },
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
}
