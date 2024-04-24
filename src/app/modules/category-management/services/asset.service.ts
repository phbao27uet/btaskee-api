import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class AssetService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    page,
    perPage,
    filter,
  }: {
    page: number;
    perPage: number;

    filter: { id?: number; name?: string; status?: string; condition?: string };
  }) {
    const newFilter = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value) {
        switch (key) {
          case "id":
            acc[key as any] = Number(value);
            break;
          case "status":
            acc[key as any] = value;
            break;

          default:
            acc[key as any] = {
              contains: value,
              mode: "insensitive",
            };
            break;
        }
      }

      return acc;
    }, {} as any);

    const [total, assets] = await Promise.all([
      this.prismaService.asset.count({
        where: {
          ...newFilter,
        },
      }),
      this.prismaService.asset.findMany({
        where: {
          ...newFilter,
        },
        include: {
          Department: true,
          Supplier: true,
          User: true,
        },
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: assets,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.prismaService.asset.findUnique({
      where: {
        id,
      },
      include: {
        Department: true,
        User: true,
      },
    });

    return data;
  }

  async create(createDto: any) {
    const data = await this.prismaService.asset.create({
      data: createDto,
    });

    return data;
  }

  async update(id: number, updateUserDto: any) {
    const updateDto = {
      ...updateUserDto,
      depreciation_rate: +updateUserDto.depreciation_rate,
      entry_price: +updateUserDto.entry_price,
      supplier_id: +updateUserDto.supplier_id,
      department_id: updateUserDto.department_id
        ? +updateUserDto.department_id
        : null,
      user_id: updateUserDto.user_id ? +updateUserDto.user_id : null,
    };

    const data = await this.prismaService.asset.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.asset.delete({
      where: {
        id,
      },
    });
  }

  recall(id: number) {
    return this.prismaService.asset.update({
      where: {
        id,
      },
      data: {
        department_id: null,
      },
    });
  }

  assign(id: number, department_id: number) {
    return this.prismaService.asset.update({
      where: {
        id,
      },
      data: {
        department_id,
      },
    });
  }
}
