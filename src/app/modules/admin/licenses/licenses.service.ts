import { Injectable, NotFoundException } from '@nestjs/common';
import { License } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateLicenseQuantityDto } from './dto/create-license-quantity.dto';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@Injectable()
export class LicensesService {
  constructor(private prismaService: PrismaService) {}

  async create(createLicenseDto: CreateLicenseDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createLicenseDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    const license = await this.prismaService.license.create({
      data: {
        m_group_id: createLicenseDto.group_id,
        generated_code: this.generateLicense(),
        expiration_date: createLicenseDto.expiration_date,
      },
    });

    const userLicense = await this.prismaService.userLicense.create({
      data: {
        user_id: user.id,
        license_id: license.id,
      },
    });

    return userLicense;
  }

  async createWithQuantity(createLicenseQuantityDto: CreateLicenseQuantityDto) {
    let codes: string[] = [];

    while (codes.length < createLicenseQuantityDto.quantity) {
      codes.push(this.generateLicense(createLicenseQuantityDto.group_id));

      codes = [...new Set(codes)];
    }

    // Check code is unique
    let isUnique = false;

    while (!isUnique) {
      const license = await this.prismaService.license.findMany({
        where: {
          generated_code: {
            in: codes,
          },
        },
      });

      if (license.length === 0) {
        isUnique = true;
      } else {
        const codeExists = license.map((l) => l.generated_code);
        const diff: string[] = codes.filter(
          (code) => !codeExists.includes(code),
        );
        codes = diff;

        while (codes.length < codeExists.length) {
          codes.push(this.generateLicense(createLicenseQuantityDto.group_id));

          codes = [...new Set(codes)];
        }
      }
    }

    await this.prismaService.license.createMany({
      data: codes.map((code) => ({
        generated_code: code,
        m_group_id: createLicenseQuantityDto.group_id,
        number_of_days: createLicenseQuantityDto.number_of_days,
        // expiration_date: new Date(+new Date() + 86400000), // 1 day
      })),
    });

    return true;
  }

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    const [total, licenses] = await Promise.all([
      this.prismaService.license.count({
        where: {
          // status: 'ACTIVE',
        },
      }),
      await this.prismaService.license.findMany({
        where: {
          // status: 'ACTIVE',
        },
        select: {
          id: true,
          generated_code: true,
          expiration_date: true,
          status: true,
          MGroup: {
            select: {
              name: true,
            },
          },
          user_licenses: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        skip: page && perPage ? (page - 1) * perPage : undefined,
        take: page && perPage ? perPage : undefined,
      }),
    ]);

    return {
      data: licenses,
      meta: {
        currentPage: page,
        perPage: perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  async findOne(code: string) {
    const license = await this.prismaService.$queryRaw<License[]>`
      SELECT l.generated_code, l.expiration_date, g.id AS group_id
      FROM License l
      LEFT JOIN MGroup g ON g.id = l.m_group_id 
      WHERE l.generated_code = ${code}
    `;

    return license?.[0] || null;
  }

  async update(code: string, updateLicenseDto: UpdateLicenseDto) {
    const license = await this.prismaService.license.findUnique({
      where: { generated_code: code },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    const updatedLicense = await this.prismaService.license.update({
      where: { generated_code: code },
      data: {
        expiration_date: license.expiration_date
          ? new Date(
              +license.expiration_date + updateLicenseDto.add_days * 86400000,
            )
          : null,

        number_of_days: license.number_of_days + updateLicenseDto.add_days,
      },
    });

    return updatedLicense;
  }

  async checkLicense(generated_code: string) {
    const license = await this.prismaService.license.findUnique({
      where: {
        generated_code: generated_code,
        expiration_date: { gte: new Date() },
      },
    });

    return !!license;
  }

  generateLicense(groupId = 0) {
    const licenseKey = groupId ? randomUUID() + `-${groupId}` : randomUUID();

    return licenseKey;
  }

  async getCurrentLicense(userId: number) {
    const license = await this.prismaService.$queryRaw<License[]>`
      SELECT l.generated_code, l.expiration_date, g.name AS group_name
      FROM License l
      LEFT JOIN UserLicense ul ON l.id = ul.license_id
      LEFT JOIN MGroup g ON g.id = l.m_group_id 
      WHERE l.status = 'ACTIVE' AND ul.user_id = ${userId}
    `;

    return license?.[0] || null;
  }
}
