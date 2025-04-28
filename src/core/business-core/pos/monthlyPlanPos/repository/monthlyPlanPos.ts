import { Injectable } from '@nestjs/common';
import { IMonthlyPlanPosRepository } from '@pos/monthlyPlanPos/interface/monthlyPlanPos';
import { PrismaService } from '@db/prisma/prisma.service';
import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';
import { PrismaMonthlyPlanPosMapper } from '@db/mapper/prisma-monthly-plan-pos-mapper';

@Injectable()
export class MonthlyPlanPosRepository extends IMonthlyPlanPosRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: MonthlyPlanPos): Promise<MonthlyPlanPos> {
    const monthlyPlanPosEntity = PrismaMonthlyPlanPosMapper.toPrisma(input);
    const monthlyPlanPos = await this.prisma.monthlyPlanPos.create({
      data: monthlyPlanPosEntity,
    });
    return PrismaMonthlyPlanPosMapper.toDomain(monthlyPlanPos);
  }

  public async findOneById(id: number): Promise<MonthlyPlanPos> {
    const monthlyPlanPos = await this.prisma.monthlyPlanPos.findFirst({
      where: {
        id,
      },
    });
    return PrismaMonthlyPlanPosMapper.toDomain(monthlyPlanPos);
  }

  public async findAllByPosId(posId: number): Promise<MonthlyPlanPos[]> {
    const monthlyPlanPoses = await this.prisma.monthlyPlanPos.findMany({
      where: {
        posId,
      },
    });
    return monthlyPlanPoses.map((item) =>
      PrismaMonthlyPlanPosMapper.toDomain(item),
    );
  }

  public async findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<MonthlyPlanPos[]> {
    const monthlyPlanPoses = await this.prisma.monthlyPlanPos.findMany({
      where: {
        posId,
        monthDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
    return monthlyPlanPoses.map((item) =>
      PrismaMonthlyPlanPosMapper.toDomain(item),
    );
  }

  public async update(input: MonthlyPlanPos): Promise<MonthlyPlanPos> {
    const monthlyPlanPosEntity = PrismaMonthlyPlanPosMapper.toPrisma(input);
    const monthlyPlanPos = await this.prisma.monthlyPlanPos.update({
      where: {
        id: input.id,
      },
      data: monthlyPlanPosEntity,
    });
    return PrismaMonthlyPlanPosMapper.toDomain(monthlyPlanPos);
  }
}
