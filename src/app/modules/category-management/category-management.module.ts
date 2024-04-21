import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { AssetController } from "./controllers/asset.controller";
import { DepartmentController } from "./controllers/department.controller";
import { ManagerController } from "./controllers/manager.controller";
import { SupplierController } from "./controllers/supplier.controller";
import { WorkerController } from "./controllers/worker.controller";
import { AssetService } from "./services/asset.service";
import { DepartmentService } from "./services/department.service";
import { ManagerService } from "./services/manager.service";
import { SupplierService } from "./services/supplier.service";
import { WorkerService } from "./services/worker.service";

@Module({
  imports: [PrismaModule],
  controllers: [
    AssetController,
    DepartmentController,
    SupplierController,
    ManagerController,
    WorkerController,
  ],
  providers: [
    AssetService,
    SupplierService,
    DepartmentService,
    ManagerService,
    WorkerService,
  ],
  exports: [
    AssetService,
    SupplierService,
    DepartmentService,
    ManagerService,
    WorkerService,
  ],
})
export class CategoryManagementModule {}
