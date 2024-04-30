import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class BuildingRentalService {
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
      name?: string;
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
      this.prismaService.buidingRental.count({
        where: {
          ...newFilter,
        },
      }),
      this.prismaService.buidingRental.findMany({
        where: {
          ...newFilter,
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
    const data = await this.prismaService.buidingRental.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(createDto: any) {
    const data = await this.prismaService.buidingRental.create({
      data: {
        ...createDto,
        size_room: +createDto.size_room,
        rental_price: +createDto.rental_price,
      },
    });
    return data;
  }

  async update(id: number, updateDto: any) {
    const data = await this.prismaService.buidingRental.update({
      where: {
        id,
      },
      data: {
        ...updateDto,
        size_room: +updateDto.size_room,
        rental_price: +updateDto.rental_price,
      },
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.buidingRental.delete({
      where: {
        id,
      },
    });
  }

  getUsers() {
    return this.prismaService.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });
  }
}
