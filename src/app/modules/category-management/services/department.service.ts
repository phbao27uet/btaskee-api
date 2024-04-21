import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    const [total, res] = await Promise.all([
      this.prismaService.department.count({
        where: {},
      }),
      this.prismaService.department.findMany({
        where: {},
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: res,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(id: number) {
    const department = await this.prismaService.department.findUnique({
      where: {
        id,
      },
    });

    return department;
  }

  async create(createDto: any) {
    const department = await this.prismaService.department.create({
      data: createDto,
    });

    return department;
  }

  async update(id: number, updateDto: any) {
    const department = await this.prismaService.department.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return department;
  }

  remove(id: number) {
    return this.prismaService.department.delete({
      where: {
        id,
      },
    });
  }
}
