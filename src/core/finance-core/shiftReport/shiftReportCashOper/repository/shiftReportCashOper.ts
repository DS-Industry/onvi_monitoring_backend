import { Injectable } from '@nestjs/common';
import { IShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/interface/shiftReportCashOper';
import { PrismaService } from '@db/prisma/prisma.service';
import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';
import { PrismaShiftReportCashOperMapper } from '@db/mapper/prisma-shift-report-cash-oper-mapper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

@Injectable()
export class ShiftReportCashOperRepository extends IShiftReportCashOperRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: ShiftReportCashOper,
  ): Promise<ShiftReportCashOper> {
    const workDayShiftReportCashOperEntity =
      PrismaShiftReportCashOperMapper.toPrisma(input);
    const workDayShiftReportCashOper =
      await this.prisma.mNGShiftReportCashOper.create({
        data: workDayShiftReportCashOperEntity,
      });
    return PrismaShiftReportCashOperMapper.toDomain(
      workDayShiftReportCashOper,
    );
  }

  public async findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<ShiftReportCashOper[]> {
    const workDayShiftReportCashOpers =
      await this.prisma.mNGShiftReportCashOper.findMany({
        where: {
          shiftReportId,
        },
      });
    return workDayShiftReportCashOpers.map((item) =>
      PrismaShiftReportCashOperMapper.toDomain(item),
    );
  }

  public async findAllByShiftReportIdAndType(
    shiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<ShiftReportCashOper[]> {
    const workDayShiftReportCashOpers =
      await this.prisma.mNGShiftReportCashOper.findMany({
        where: {
          shiftReportId,
          type,
        },
      });
    return workDayShiftReportCashOpers.map((item) =>
      PrismaShiftReportCashOperMapper.toDomain(item),
    );
  }
}
