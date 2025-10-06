import { ShiftReportCalculationPaymentResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-calculation-payment-response.dto';
import { PrepaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/prepayment-calculate-response.dro';

export class PrepaymentCalculateResponseMapper {
  static toResponse(
    shiftReportData: ShiftReportCalculationPaymentResponseDto[],
  ): PrepaymentCalculateResponseDro[] {
    return shiftReportData.map((item) => ({
      hrWorkerId: item.hrWorkerId,
      employeeName: item.name,
      name: item.name,
      hrPositionId: item.hrPositionId,
      billingMonth: item.billingMonth,
      dailySalary: item.dailySalary,
      bonusPayout: item.maxBonusSalary,
      numberOfShiftsWorked: item.countShifts,
      sum: item.sum,
      payoutTimestamp: undefined,
    }));
  }
}
