import { BadRequestException, Injectable } from '@nestjs/common';
import { License } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CheckLicenseDto } from './dto/check-license.dto';
import { UserLicenseDto } from './dto/user-license.dto';

@Injectable()
export class LicensesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userLicenseDto: UserLicenseDto, userId: number) {
    const currentLicense = await this.getCurrentLicense(userId);

    if (
      currentLicense &&
      currentLicense.generated_code === userLicenseDto.code
    ) {
      throw new BadRequestException('License already used');
    }

    const license = await this.prismaService.license.findFirst({
      where: {
        generated_code: userLicenseDto.code,
        status: 'INACTIVE',
        OR: [
          {
            expiration_date: {
              gte: new Date(),
            },
          },
          {
            expiration_date: null,
          },
        ],
      },
      select: {
        id: true,
        expiration_date: true,
        number_of_days: true,
        status: true,

        user_licenses: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (
      license &&
      (!license?.user_licenses.length ||
        (license?.user_licenses.length &&
          license?.user_licenses?.[0].user_id == userId))
    ) {
      await this.prismaService.license.updateMany({
        where: {
          user_licenses: {
            some: {
              user_id: userId,
            },
          },
        },
        data: {
          status: 'INACTIVE',
        },
      });

      await this.prismaService.license.update({
        where: {
          id: license.id,
        },
        data: {
          status: 'ACTIVE',
          ...(!license.expiration_date && {
            expiration_date: new Date(
              Date.now() + license.number_of_days * 24 * 60 * 60 * 1000,
            ),
          }),
        },
      });

      await this.prismaService.userLicense.upsert({
        create: {
          user_id: userId,
          license_id: license.id,
        },
        update: {},
        where: {
          user_id_license_id: {
            license_id: license.id,
            user_id: userId,
          },
        },
      });
    } else {
      throw new BadRequestException('Invalid license');
    }

    return 'License activated';
  }

  async checkLicense(checkLicenseDto: CheckLicenseDto) {
    const licenses: License[] = await this.prismaService.$queryRaw`
    SELECT l.id, l.generated_code, l.number_of_days, g.name AS group_name, l.expiration_date, l.status 
    FROM License l
    LEFT JOIN UserLicense ul ON l.id = ul.license_id
    LEFT JOIN MGroup g ON g.id = l.m_group_id 
    WHERE ul.user_id = ${checkLicenseDto.user_id} AND l.expiration_date >= NOW() AND l.status = 'ACTIVE'
  `;

    return licenses?.length > 0;
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
