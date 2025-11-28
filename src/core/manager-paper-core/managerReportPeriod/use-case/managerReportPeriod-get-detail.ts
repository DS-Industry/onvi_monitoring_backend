import { Injectable } from '@nestjs/common';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import {
  GetDetailDto,
  ManagerPaperForPeriodDto,
} from '@manager-paper/managerReportPeriod/use-case/dto/get-detail.dto';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { ManagerPaperTypeClass } from '@prisma/client';

@Injectable()
export class GetDetailManagerReportPeriodUseCase {
  constructor(
    private readonly findMethodsManagerPaperUseCase: FindMethodsManagerPaperUseCase,
  ) {}

  async execute(data: ManagerReportPeriod): Promise<GetDetailDto> {
    const managerPapers =
      await this.findMethodsManagerPaperUseCase.getAllByFilterWithType({
        userId: data.userId,
        dateStartEvent: data.startPeriod,
        dateEndEvent: data.endPeriod,
      });

    let receiptSum = 0;
    let expenditureSum = 0;

    managerPapers.forEach((paper) => {
      if (paper.paperTypeType === ManagerPaperTypeClass.RECEIPT) {
        receiptSum += paper.sum;
      } else if (paper.paperTypeType === ManagerPaperTypeClass.EXPENDITURE) {
        expenditureSum += paper.sum;
      }
    });

    const shortage =
      data.sumEndPeriod - receiptSum + expenditureSum - data.sumStartPeriod;

    const managerPaperDtos: ManagerPaperForPeriodDto[] = managerPapers.map(
      (paper) => ({
        group: paper.group,
        posId: paper.posId,
        paperTypeId: paper.paperTypeId,
        paperTypeName: paper.paperTypeName,
        paperTypeType: paper.paperTypeType,
        eventDate: paper.eventDate,
        sum: paper.sum,
        imageProductReceipt: paper.imageProductReceipt,
      }),
    );

    return {
      id: data.id,
      status: data.status,
      startPeriod: data.startPeriod,
      endPeriod: data.endPeriod,
      sumStartPeriod: data.sumStartPeriod,
      sumEndPeriod: data.sumEndPeriod,
      shortage: shortage,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdById: data.createdById,
      updatedById: data.updatedById,
      managerPaper: managerPaperDtos,
    };
  }
}
