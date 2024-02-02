import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateTrueCountSettingDto } from './dto/update-true-count-setting.dto';

@Injectable()
export class TrueCountSettingService {
  constructor(private prisma: PrismaService) {}

  async getTrueCountSetting() {
    return await this.prisma.trueCountSetting.findUnique({
      where: {
        id: 1,
      },
    });
  }

  async updateTrueCountSetting(
    updateTrueCountSettingDto: UpdateTrueCountSettingDto,
  ) {
    return await this.prisma.trueCountSetting.update({
      where: {
        id: 1,
      },
      data: {
        true_count: updateTrueCountSettingDto.true_count,
      },
    });
  }

  async getAllTrueCount({ page, perPage }: { page: number; perPage: number }) {
    const [total, tables] = await Promise.all([
      this.prisma.table.count({}),
      await this.prisma.table.findMany({
        include: {
          WebsiteTable: {
            select: {
              website: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
        orderBy: {
          updated_at: 'desc',
        },
      }),
    ]);

    const tablesResult = tables.map((table) => {
      const websites = table.WebsiteTable.map((websiteTable) => {
        return websiteTable?.website?.name;
      }).join(', ');

      const { WebsiteTable: _, ...rest } = table; // This is a nested object, and it's not clear what the intention is here

      return {
        ...rest,
        websites,
      };
    });

    return {
      data: tablesResult,
      meta: {
        currentPage: page,
        perPage: perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }
}
