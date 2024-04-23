import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class SupplierService {
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

    const [total, suppliers] = await Promise.all([
      this.prismaService.supplier.count({
        where: {
          ...newFilter,
        },
      }),
      this.prismaService.supplier.findMany({
        where: {
          ...newFilter,
        },
        include: {
          Asset: true,
        },
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: suppliers,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(id: number) {
    const supplier = await this.prismaService.supplier.findUnique({
      where: {
        id,
      },
    });

    return supplier;
  }

  async create(createDto: any) {
    const supplier = await this.prismaService.supplier.create({
      data: createDto,
    });

    return supplier;
  }

  async update(id: number, updateDto: any) {
    const supplier = await this.prismaService.supplier.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return supplier;
  }

  remove(id: number) {
    return this.prismaService.supplier.delete({
      where: {
        id,
      },
    });
  }
}
