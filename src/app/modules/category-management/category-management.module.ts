import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { CategoryManagementController } from "./category-management.controller";
import { AssetService } from "./services/asset.service";
import { DepartmentService } from "./services/department.service";
import { SupplierService } from "./services/supplier.service";

@Module({
  imports: [PrismaModule],
  controllers: [CategoryManagementController],
  providers: [AssetService, SupplierService, DepartmentService],
  exports: [AssetService, SupplierService, DepartmentService],
})
export class CategoryManagementModule {}
