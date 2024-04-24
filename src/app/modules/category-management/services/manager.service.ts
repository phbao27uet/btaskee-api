import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class ManagerService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    page,
    perPage,
    filter,
  }: {
    page: number;
    perPage: number;

    filter: { id?: number; name?: string };
  }) {
    const newFilter = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value) {
        if (key == "id") {
          acc[key as any] = Number(value);
          return acc;
        }

        acc[key as any] = {
          contains: value,
          mode: "insensitive",
        };
      }

      return acc;
    }, {} as any);

    const [total, res] = await Promise.all([
      this.prismaService.user.count({
        where: {
          role: "MANAGER",
          ...newFilter,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          role: "MANAGER",
          ...newFilter,
        },
        include: {
          Department: true,
          Asset: true,
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

  async findAllManagersWorkers({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) {
    const [total, res] = await Promise.all([
      this.prismaService.user.count({
        where: {
          OR: [
            {
              role: "MANAGER",
            },
            {
              role: "WORKER",
            },
          ],
        },
      }),
      this.prismaService.user.findMany({
        where: {
          OR: [
            {
              role: "MANAGER",
            },
            {
              role: "WORKER",
            },
          ],
        },
        include: {
          Department: true,
          Asset: true,
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
        role: "MANAGER",
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
        role: "MANAGER",
      },
    });

    return res;
  }

  async update(id: number, updateDto: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: updateDto.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const res = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateDto,
      },
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
