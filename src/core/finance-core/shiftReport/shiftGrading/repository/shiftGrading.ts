import { Injectable } from '@nestjs/common';
import { IShiftGradingRepository } from '@finance/shiftReport/shiftGrading/interface/shiftGrading';
import { PrismaService } from '@db/prisma/prisma.service';
import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';
import { PrismaShiftGradingMapper } from '@db/mapper/prisma-shift-grading-mapper';

@Injectable()
export class ShiftGradingRepository extends IShiftGradingRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async createMany(input: ShiftGrading[]): Promise<void> {
    const shiftGradingEntities = input.map((item) =>
      PrismaShiftGradingMapper.toPrisma(item),
    );

    await this.prisma.mNGShiftGrading.createMany({
      data: shiftGradingEntities,
    });
  }

  public async findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<ShiftGrading[]> {
    const shiftGradings = await this.prisma.mNGShiftGrading.findMany({
      where: {
        shiftReportId,
      },
    });

    return shiftGradings.map((item) => PrismaShiftGradingMapper.toDomain(item));
  }

  public async updateMany(input: ShiftGrading[]): Promise<void> {
    const updates = input.map((item) => {
      return this.prisma.mNGShiftGrading.update({
        where: { id: item.id },
        data: PrismaShiftGradingMapper.toPrisma(item),
      });
    });

    await this.prisma.$transaction(updates);
  }
}
