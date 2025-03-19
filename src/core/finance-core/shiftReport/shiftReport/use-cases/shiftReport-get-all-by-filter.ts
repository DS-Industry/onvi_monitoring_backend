import { Injectable } from '@nestjs/common';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import {
  ShiftReportsDataResponseDto,
  ShiftReportsResponseDto,
} from '@platform-user/core-controller/dto/response/shift-reports-response.dto';

@Injectable()
export class GetAllByFilterShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
  ) {}

  async execute(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<ShiftReportsResponseDto> {
    const response: ShiftReportsDataResponseDto[] = [];
    const count =
      await this.findMethodsShiftReportUseCase.getCountAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
      );
    const shiftReports =
      await this.findMethodsShiftReportUseCase.getAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
        skip,
        take,
      );
    shiftReports.map((shiftReport) =>
      response.push({
        id: shiftReport.id,
        posId: shiftReport.posId,
        period:
          shiftReport.startDate.toString() +
          '-' +
          shiftReport.endDate.toString(),
        createdAt: shiftReport.createdAt,
        updatedAt: shiftReport.updatedAt,
        createdById: shiftReport.createdById,
        updatedById: shiftReport.updatedById,
      }),
    );
    return { shiftReportsData: response, totalCount: count };
  }
}
