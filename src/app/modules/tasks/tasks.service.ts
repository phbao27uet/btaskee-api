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
    userId,
    filter,
  }: {
    page: number;
    perPage: number;
    userId: number;
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

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const condition =
      user.role === 'JOB_POSTER'
        ? {
            job_poster_id: userId,
          }
        : {};

    const [total, data] = await Promise.all([
      this.prismaService.task.count({
        where: {
          ...newFilter,
          ...condition,
        },
      }),
      this.prismaService.task.findMany({
        where: {
          ...newFilter,
          ...condition,
        },
        include: {
          job_poster: true,
          job_seeker: true,
          order: true,
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
      include: {
        job_poster: true,
        job_seeker: true,
        order: true,
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
    return this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async apply({ userId, taskId }: { userId: number; taskId: number }) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.job_seeker_id) {
      throw new Error('Task already has job seeker');
    }

    return this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: 'HIRING',
        job_seeker_id: userId,
      },
    });
  }

  async mine({
    page,
    perPage,
    userId,
  }: {
    page: number;
    perPage: number;
    userId: number;
  }) {
    const [total, data] = await Promise.all([
      this.prismaService.task.count({
        where: {
          job_seeker_id: userId,
        },
      }),
      this.prismaService.task.findMany({
        where: {
          job_seeker_id: userId,
        },
        include: {
          job_poster: true,
          job_seeker: true,
          order: true,
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

  async complete({ userId, taskId }: { userId: number; taskId: number }) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.job_seeker_id !== userId) {
      throw new Error('Task not found');
    }

    return this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async recommend() {
    // TODO: Implement recommendation logic
    // Recommend tasks have status 'PENDING' and have start_date > now 30 minutes

    const [total, data] = await Promise.all([
      this.prismaService.task.count({
        where: {
          status: 'PENDING',
          // start_date: {
          //   gt: new Date(new Date().getTime() - 30 * 60 * 1000),
          // },
        },
      }),
      this.prismaService.task.findMany({
        where: {
          status: 'PENDING',
          // start_date: {
          //   gt: new Date(new Date().getTime() - 30 * 60 * 1000),
          // },
        },
        include: {
          job_poster: true,
          job_seeker: true,
          order: true,
        },
      }),
    ]);

    return {
      data: data,
      meta: {
        currentPage: 1,
        perPage: total,
        total: total ?? 0,
        totalPages: 1,
      },
    };
  }
}
