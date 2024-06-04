import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDto: any) {
    const data = await this.prismaService.user.create({
      data: {
        ...createDto,
      },
    });

    return data;
  }

  async applySeeker(userId: number) {
    const dataExits = await this.prismaService.userApplySeeker.findFirst({
      where: {
        userId: userId,
      },
    });

    if (dataExits && dataExits.status === 'PENDING') {
      throw new BadRequestException(
        'Bạn đã tạo yêu cầu. Vui lòng đợi quản trị viên xác nhận!',
      );
    }

    if (dataExits && dataExits.status === 'ACCEPTED') {
      throw new BadRequestException(
        'Bạn đã là người tìm việc! Vui lòng đăng nhập lại!',
      );
    }

    const data = await this.prismaService.userApplySeeker.create({
      data: {
        userId: userId,
      },
    });

    return data;
  }

  async handleApplySeeker(dto: any) {
    const data = await this.prismaService.userApplySeeker.update({
      where: {
        id: +dto.id,
      },
      data: {
        status: dto.status,

        user: {
          update: {
            role: dto.status === 'ACCEPTED' ? 'JOB_SEEKER' : 'JOB_POSTER',
          },
        },
      },
    });

    return data;
  }

  async findAllApplySeeker({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) {
    const [total, data] = await Promise.all([
      this.prismaService.userApplySeeker.count({
        where: {
          status: 'PENDING',
        },
      }),
      this.prismaService.userApplySeeker.findMany({
        where: {
          status: 'PENDING',
        },
        include: {
          user: true,
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
      this.prismaService.user.count({
        where: {
          role: {
            in: ['JOB_POSTER', 'JOB_SEEKER'],
          },
          ...newFilter,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          role: {
            in: ['JOB_POSTER', 'JOB_SEEKER'],
          },
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
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async update(id: number, updateDto: any) {
    const data = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
