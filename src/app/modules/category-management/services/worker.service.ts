import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class WorkerService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    const [total, res] = await Promise.all([
      this.prismaService.user.count({
        where: {
          role: "WORKER",
        },
      }),
      this.prismaService.user.findMany({
        where: {
          role: "WORKER",
        },
        include: {
          Department: true,
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
    const res = await this.prismaService.user.findUnique({
      where: {
        id,
        role: "WORKER",
      },
      include: {
        Department: true,
      },
    });

    return res;
  }

  async create(createDto: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createDto.email,
      },
    });

    if (user) {
      throw new BadRequestException("Email đã tồn tại");
    }

    const res = await this.prismaService.user.create({
      data: {
        ...createDto,
        role: "WORKER",
      },
    });

    return res;
  }

  async update(id: number, updateDto: any) {
    const res = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateDto,
    });

    return res;
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
