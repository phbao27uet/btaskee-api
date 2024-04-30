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

    filter: {
      id?: number;
      implemention_date?: string;
      petition_date?: string;
    };
  }) {
    const newFilter = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value) {
        switch (key) {
          case 'id':
          case 'department_id':
            acc[key as any] = Number(value);
            break;
          case 'status':
          case 'condition':
            acc[key as any] = value;
            break;
          case 'implemention_date':
          case 'petition_date':
            acc[key as any] = {
              // Add 1 day to the date to include the whole day
              gte: new Date(value),
              lt: new Date(
                new Date(value).setDate(new Date(value).getDate() + 1),
              ),
            };
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
          PlanAsset: {
            include: {
              Supplier: true,
            },
          },
          User: true,
          Department: {
            include: {
              User: true,
            },
          },
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
        PlanAsset: {
          include: {
            Supplier: true,
          },
        },
        User: true,
        Department: {
          include: {
            User: true,
          },
        },
      },
    });

    return data;
  }

  async create(createDto: any) {
    const asset = await this.prismaService.planAsset.create({
      data: {
        asset_name: createDto.asset_name,
        status: 'READY_TO_USE',
        supplier_id: +createDto.supplier_id,
      },
    });

    const data = await this.prismaService.plans.create({
      data: {
        implemention_date: createDto.implemention_date,
        petition_date: createDto.petition_date,
        description_plan: createDto.description_plan,
        type: 'SHOPPING',
        status: 'PENDING',
        user_id: +createDto.user_id,
        plan_asset_id: asset.id,
        quantity: +createDto.quantity,
      },
    });

    return data;
  }

  async update(id: number, updateDto: any) {
    const data = await this.prismaService.plans.update({
      where: {
        id,
      },
      data: {
        implemention_date: updateDto.implemention_date,
        petition_date: updateDto.petition_date,
        description_plan: updateDto.description_plan,
        quantity: +updateDto.quantity,
        user_id: +updateDto.user_id,
      },
    });

    await this.prismaService.recommendPlanAsset.update({
      where: {
        id: data.plan_asset_id,
      },
      data: {
        asset_name: updateDto.asset_name,
        status: 'READY_TO_USE',
        supplier_id: +updateDto.supplier_id,
      },
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
