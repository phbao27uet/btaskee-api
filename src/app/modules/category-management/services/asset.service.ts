import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class AssetService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    const [total, assets] = await Promise.all([
      this.prismaService.asset.count({
        where: {},
      }),
      this.prismaService.asset.findMany({
        where: {},
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: assets,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.prismaService.asset.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(createDto: any) {
    const data = await this.prismaService.asset.create({
      data: createDto,
    });

    return data;
  }

  async update(id: number, updateUserDto: any) {
    const data = await this.prismaService.asset.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return data;
  }

  remove(id: number) {
    return this.prismaService.asset.delete({
      where: {
        id,
      },
    });
  }
}
