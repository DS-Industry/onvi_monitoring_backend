import { Injectable } from '@nestjs/common';
import { PaymentType } from '@prisma/client';
import { PaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/payment-calculate-response.dro';
import { FindMethodsPaymentUseCase } from '@hr/payment/use-case/payment-find-methods';
import { ShiftReportCalculationPaymentResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-calculation-payment-response.dto';

@Injectable()
export class CalculatePaymentUseCase {
  constructor(
    private readonly findMethodsPaymentUseCase: FindMethodsPaymentUseCase,
  ) {}

  async payment(
    data: ShiftReportCalculationPaymentResponseDto[],
  ): Promise<PaymentCalculateResponseDro[]> {
    if (data.length === 0) {
      return [];
    }

    const prepayments = await this.findMethodsPaymentUseCase.getAllForCalculate(
      data.map((w) => w.hrWorkerId),
      PaymentType.PREPAYMENT,
      data[0].billingMonth,
    );

    const prepaymentSumMap = new Map<number, number>();
    const prepaymentCountShiftsMap = new Map<number, number>();

    prepayments.forEach((payment) => {
      const currentSum = prepaymentSumMap.get(payment.hrWorkerId) || 0;
      prepaymentSumMap.set(payment.hrWorkerId, currentSum + payment.sum);

      const currentCount =
        prepaymentCountShiftsMap.get(payment.hrWorkerId) || 0;
      prepaymentCountShiftsMap.set(
        payment.hrWorkerId,
        currentCount + payment.countShifts,
      );
    });

    return data.map((calculateDate) => ({
      hrWorkerId: calculateDate.hrWorkerId,
      name: calculateDate.name,
      employeeName: calculateDate.name,
      hrPositionId: calculateDate.hrPositionId,
      billingMonth: calculateDate.billingMonth,
      dailySalary: calculateDate.dailySalary,
      bonusPayout: calculateDate.maxBonusSalary,
      numberOfShiftsWorked: calculateDate.countShifts,
      prepaymentSum: prepaymentSumMap.get(calculateDate.hrWorkerId) || 0,
      sum: calculateDate.sum,
    }));
  }
}
