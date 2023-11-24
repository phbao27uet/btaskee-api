import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, perPage }: { page: number; perPage: number }) {
    // query raw
    // get all users with player logs and game logs
    // get average rtp value each user

    const [total, users] = await Promise.all([
      await this.prismaService.user.count({}),
      await this.prismaService.$queryRaw`
      SELECT u.id, u.name, u.email, 
        pl.play_count, pl.play_time,
        SUM(gl.money_bet) as expenses, 
        SUM(gl.money_returned) as total_money_returned, 
        AVG(gl.rtp_value) as rpt_value FROM User u 
      LEFT JOIN PlayerLog pl ON u.id = pl.user_id
      LEFT JOIN GameLog gl ON pl.id = gl.player_log_id
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
