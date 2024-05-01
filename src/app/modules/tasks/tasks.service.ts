import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, createDto: any) {
    const data = await this.prismaService.task.create({
      data: {
        job_poster_id: userId,
        ...createDto,
      },
    });

    return data;
  }

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

    const [total, data] = await Promise.all([
      this.prismaService.task.count({
        where: {
          ...newFilter,
        },
      }),
      this.prismaService.task.findMany({
        where: {
          ...newFilter,
        },
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: data,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async update(id: number, updateDto: any) {
    const data = await this.prismaService.task.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }
}
