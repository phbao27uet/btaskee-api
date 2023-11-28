import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { MailService } from 'src/shared/mail/mail.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { USER_STATUS } from 'src/utils/constants';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserReportDto } from './dtos/user-report.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private mailService: MailService,
  ) {}

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
      SELECT u.id, u.name, u.email, u.furigana, u.created_at,
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

  async findOne(id: number) {
    const users = (await this.prismaService.$queryRaw`
    SELECT u.id, u.name, u.email, u.furigana, u.created_at,
      pl.play_count, pl.play_time,
      SUM(gl.money_bet) as expenses, 
      SUM(gl.money_returned) as total_money_returned, 
      AVG(gl.rtp_value) as rpt_value FROM User u 
    LEFT JOIN PlayerLog pl ON u.id = pl.user_id
    LEFT JOIN GameLog gl ON pl.id = gl.player_log_id
    WHERE u.id = ${id} AND u.status = ${USER_STATUS['APPROVED']}
    GROUP BY u.id
  `) as User[];

    return users?.length ? users?.[0] : null;
  }

  async getUserReport(id: number, userReportDto: UserReportDto) {
    const users = await this.prismaService.$queryRaw`
      SELECT
        Date(gl.created_at) as date,
        CAST(COUNT(Date(gl.created_at)) AS CHAR) as play_count_per_day,
        (SUM(gl.money_returned) - SUM(gl.money_bet)) as incomes,
        SUM(gl.money_bet) as expenses, 
        SUM(gl.money_returned) as total_money_returned, 
        AVG(gl.rtp_value) as rpt_value FROM User u 
      LEFT JOIN PlayerLog pl ON u.id = pl.user_id
      LEFT JOIN GameLog gl ON pl.id = gl.player_log_id
      WHERE u.id = ${id} AND u.status = ${USER_STATUS['APPROVED']} AND Date(gl.created_at) >= ${userReportDto.start_date} AND Date(gl.created_at) <= ${userReportDto.end_date}
      GROUP BY Date(gl.created_at)
      ORDER BY Date(gl.created_at);
    `;

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    if (user.status === USER_STATUS['APPROVED']) {
      await this.mailService.sendMailApproved(user.email, user.name);
    }

    return true;
  }

  remove(id: number) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        status: 'DELETED',
      },
    });
  }
}
