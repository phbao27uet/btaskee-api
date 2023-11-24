import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { USER_STATUS } from 'src/utils/constants';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    page,
    perPage,
    status,
  }: {
    page: number;
    perPage: number;
    status: keyof typeof USER_STATUS;
  }) {
    // query raw
    // get all users with player logs and game logs
    // get average rtp value each user

    const [total, users] = await Promise.all([
      await this.prismaService.user.count({
        where: {
          status: status,
        },
      }),
      await this.prismaService.$queryRaw`
      SELECT u.id, u.name, u.email, u.created_at,
        pl.play_count, pl.play_time,
        SUM(gl.money_bet) as expenses, 
        SUM(gl.money_returned) as total_money_returned, 
        AVG(gl.rtp_value) as rpt_value FROM User u 
      LEFT JOIN PlayerLog pl ON u.id = pl.user_id
      LEFT JOIN GameLog gl ON pl.id = gl.player_log_id
      WHERE u.status = ${status}
      GROUP BY u.id
      LIMIT ${page && perPage ? perPage : undefined}
      OFFSET ${page && perPage ? (page - 1) * perPage : undefined}
    `,
    ]);

    return {
      data: users,
      meta: {
        currentPage: page,
        perPage,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / perPage),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
