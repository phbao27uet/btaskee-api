import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const groups = await this.prismaService.mGroup.findMany({});

    return groups;
  }

  findOne(id: number) {
    return id;
  }
}
