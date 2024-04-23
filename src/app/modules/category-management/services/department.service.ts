import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    page,
    perPage,
    filter,
  }: {
    page: number;
    perPage: number;
    filter: { id?: number; name?: string };
  }) {
    const newFilter = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value) {
        if (key == "id") {
          acc[key as any] = Number(value);
          return acc;
        }

        acc[key as any] = {
          contains: value,
          mode: "insensitive",
        };
      }

      return acc;
    }, {} as any);

    const [total, res] = await Promise.all([
      this.prismaService.department.count({
        where: { ...newFilter },
      }),
      this.prismaService.department.findMany({
        where: { ...newFilter },
        include: {
          User: true,
          Asset: true,
        },
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
      include: {
        User: true,
        Asset: true,
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
