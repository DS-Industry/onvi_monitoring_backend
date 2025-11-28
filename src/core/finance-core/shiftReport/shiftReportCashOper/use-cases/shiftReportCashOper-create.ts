import { Injectable } from '@nestjs/common';
import { IShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/interface/shiftReportCashOper';
import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';
import { ShiftReportCashOperCreateDto } from '@finance/shiftReport/shiftReportCashOper/use-cases/dto/shiftReportCashOper-create.dto';
import { User } from '@platform-user/user/domain/user';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';

@Injectable()
export class CreateShiftReportCashOperUseCase {
  constructor(
    private readonly shiftReportCashOperRepository: IShiftReportCashOperRepository,
    private readonly updateShiftReportUseCase: UpdateShiftReportUseCase,
  ) {}

  async execute(
    data: ShiftReportCashOperCreateDto,
    shiftReport: ShiftReport,
    user: User,
  ): Promise<ShiftReportCashOper> {
    const shiftReportCashOperData = new ShiftReportCashOper({
      shiftReportId: shiftReport.id,
      sum: data.sum,
      type: data.type,
      carWashDeviceId: data?.carWashDeviceId,
      eventDate: data?.eventData,
      comment: data?.comment,
    });
    const shiftReportCashOper = await this.shiftReportCashOperRepository.create(
      shiftReportCashOperData,
    );
    await this.updateShiftReportUseCase.execute({}, shiftReport, user);
    return shiftReportCashOper;
  }
}
