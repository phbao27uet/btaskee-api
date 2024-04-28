import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ShoppingService {
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
          case 'id':
            acc[key as any] = Number(value);
            break;
          case 'status':
          case 'condition':
            acc[key as any] = value;
            break;

          default:
            acc[key as any] = {
              contains: value,
              mode: 'insensitive',
            };
            break;
        }
      }

      return acc;
    }, {} as any);

    const [total, res] = await Promise.all([
      this.prismaService.plans.count({
        where: {
          ...newFilter,
          type: 'SHOPPING',
        },
      }),
      this.prismaService.plans.findMany({
        where: {
          ...newFilter,
        },
        include: {
          Department: true,
          User: true,
          PlanAsset: true,
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
    const data = await this.prismaService.plans.findUnique({
      where: {
        id,
        type: 'SHOPPING',
      },
      include: {
        Department: true,
        User: true,
        PlanAsset: true,
      },
    });

    return data;
  }

  async create(createDto: any) {
    const data = await this.prismaService.plans.create({
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
    };

    console.log(updateDto);

    const data = await this.prismaService.plans.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.plans.delete({
      where: {
        id,
      },
    });
  }
}
