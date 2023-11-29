import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateLicenseQuantityDto } from './dto/create-license-quantity.dto';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@Injectable()
export class LicensesService {
  constructor(private prismaService: PrismaService) {}

  async create(createLicenseDto: CreateLicenseDto) {
    console.log('createLicenseDto', createLicenseDto);

    const user = await this.prismaService.user.findUnique({
      where: { id: createLicenseDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const license = await this.prismaService.license.create({
      data: {
        m_group_id: createLicenseDto.group_id,
        generated_code: this.generateLicense(),
        expiration_date: createLicenseDto.expiration_date,
      },
    });

    console.log(license);

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
      codes.push(this.generateLicense());

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
          codes.push(this.generateLicense());

          codes = [...new Set(codes)];
        }
      }
    }

    await this.prismaService.license.createMany({
      data: codes.map((code) => ({
        generated_code: code,
        m_group_id: createLicenseQuantityDto.group_id,
        expiration_date: new Date(+new Date() + 86400000), // 1 day
      })),
    });

    return true;
  }

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    console.log({ page, perPage });

    const [total, licenses] = await Promise.all([
      this.prismaService.license.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      await this.prismaService.license.findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          generated_code: true,
          expiration_date: true,
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

  findOne(id: number) {
    return id;
  }

  update(id: number, updateLicenseDto: UpdateLicenseDto) {
    console.log('updateLicenseDto', updateLicenseDto);

    return `This action updates a #${id} license`;
  }

  remove(id: number) {
    return `This action removes a #${id} license`;
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

  generateLicense() {
    const licenseKey = randomUUID();

    return licenseKey;
  }
}
