import { Injectable } from '@nestjs/common';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { ManagerPaperGroup, ManagerPaperTypeClass } from '@prisma/client';
import { ManagerPapersStatisticResponseDto } from '@platform-user/core-controller/dto/response/managerPapersStatistic-response.dto';

@Injectable()
export class StatisticManagerPaperUseCase {
  constructor(
    private readonly findMethodsManagerPaperUseCase: FindMethodsManagerPaperUseCase,
  ) {}

  async execute(data: {
    ability?: any;
    group?: ManagerPaperGroup;
    posId?: number;
    paperTypeId?: number;
    userId?: number;
    dateStartEvent?: Date;
    dateEndEvent?: Date;
  }): Promise<ManagerPapersStatisticResponseDto> {
    const managerPapers =
      await this.findMethodsManagerPaperUseCase.getAllByFilterWithType({
        ability: data.ability,
        group: data.group,
        posId: data.posId,
        paperTypeId: data.paperTypeId,
        userId: data.userId,
        dateStartEvent: data.dateStartEvent,
        dateEndEvent: data.dateEndEvent,
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
    return {
      receipt: receiptSum,
      expenditure: expenditureSum,
      balance: receiptSum - expenditureSum,
    };
  }
}
