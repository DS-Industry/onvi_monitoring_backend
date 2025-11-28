import { PosPositionSalaryRate } from '@finance/shiftReport/posPositionSalaryRate/domain/posPositionSalaryRate';

export abstract class IPosPositionSalaryRateRepository {
  abstract findOneByPosIdAndHrPositionId(
    posId: number,
    hrPositionId: number,
  ): Promise<PosPositionSalaryRate | null>;
  abstract findAllByPosId(posId: number): Promise<PosPositionSalaryRate[]>;
  abstract upsert(input: PosPositionSalaryRate): Promise<PosPositionSalaryRate>;
}

