import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class RecommendedShoppingMaintenanceService {
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
      department_id?: number;
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
      this.prismaService.recommendPlan.count({
        where: {
          ...newFilter,
          type: 'MAINTENANCE',
        },
      }),
      this.prismaService.recommendPlan.findMany({
        where: {
          ...newFilter,
          type: 'MAINTENANCE',
        },
        include: {
          RecommendPlanAsset: {
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
    const data = await this.prismaService.recommendPlan.findUnique({
      where: {
        id,
        type: 'MAINTENANCE',
      },
      include: {
        RecommendPlanAsset: {
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
    console.log('createDto', createDto);

    const asset = await this.prismaService.recommendPlanAsset.create({
      data: {
        asset_name: createDto.asset_name,
        status: 'MAINTENANCE',
        supplier_id: +createDto.supplier_id,
      },
    });

    const data = await this.prismaService.recommendPlan.create({
      data: {
        implemention_date: createDto.implemention_date,
        petition_date: createDto.petition_date,
        description_plan: createDto.description_plan,
        type: 'MAINTENANCE',
        status: 'PENDING',
        department_id: +createDto.department_id,
        recommend_plan_asset_id: asset.id,
      },
    });

    return data;
  }

  async update(id: number, updateDto: any) {
    const data = await this.prismaService.recommendPlan.update({
      where: {
        id,
      },
      data: {
        implemention_date: updateDto.implemention_date,
        petition_date: updateDto.petition_date,
        description_plan: updateDto.description_plan,
        department_id: +updateDto.department_id,
      },
    });

    await this.prismaService.recommendPlanAsset.update({
      where: {
        id: data.recommend_plan_asset_id,
      },
      data: {
        asset_name: updateDto.asset_name,
        status: 'MAINTENANCE',
        supplier_id: +updateDto.supplier_id,
      },
    });

    return data;
  }

  async updateStatus(id: number, updateDto: any) {
    const data = await this.prismaService.recommendPlan.update({
      where: {
        id,
      },
      data: {
        status: updateDto.status,
        evaluation: updateDto.evaluation,
      },
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.recommendPlan.delete({
      where: {
        id,
      },
    });
  }
}
