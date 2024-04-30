import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class LiquidationService {
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
      this.prismaService.liquidationAsset.count({
        where: {
          ...newFilter,
        },
      }),
      this.prismaService.liquidationAsset.findMany({
        where: {
          ...newFilter,
        },
        include: {
          User: true,
          Asset: {
            include: {
              Supplier: true,
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
    const data = await this.prismaService.liquidationAsset.findUnique({
      where: {
        id,
      },
      include: {
        User: true,
        Asset: {
          include: {
            Supplier: true,
          },
        },
      },
    });

    return data;
  }

  async create(createDto: any) {
    const asset = await this.prismaService.asset.findUnique({
      where: {
        id: +createDto.asset_id,
      },
    });

    const data = await this.prismaService.liquidationAsset.create({
      data: {
        implemention_date: createDto.implemention_date,
        petition_date: createDto.petition_date,
        description_plan: createDto.description_plan,
        status: 'PENDING',
        type: 'SHOPPING',
        quantity: +createDto.quantity,
        asset_purchasing_unit: createDto.asset_purchasing_unit,
        liquidation_price: +createDto.liquidation_price,
        asset_id: +createDto.asset_id,
        evaluation: 'xxx',
        user_id: +createDto.user_id,
        original_price: Number(asset?.entry_price) ?? 0,
      },
    });
    return data;
  }

  async update(id: number, updateDto: any) {
    const asset = await this.prismaService.asset.findUnique({
      where: {
        id: +updateDto.asset_id,
      },
    });

    const data = await this.prismaService.liquidationAsset.update({
      where: {
        id,
      },
      data: {
        implemention_date: updateDto.implemention_date,
        petition_date: updateDto.petition_date,
        description_plan: updateDto.description_plan,
        quantity: +updateDto.quantity,
        asset_purchasing_unit: updateDto.asset_purchasing_unit,
        liquidation_price: +updateDto.liquidation_price,
        asset_id: +updateDto.asset_id,
        user_id: +updateDto.user_id,
        original_price: Number(asset?.entry_price) ?? 0,
      },
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.liquidationAsset.delete({
      where: {
        id,
      },
    });
  }
}
