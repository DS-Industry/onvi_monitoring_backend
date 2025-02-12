import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { User } from '@platform-user/user/domain/user';

export abstract class IShiftReportRepository {
  abstract create(input: ShiftReport): Promise<ShiftReport>;
  abstract findOneById(id: number): Promise<ShiftReport>;
  abstract addWorker(id: number, userId: number): Promise<ShiftReport>;
  abstract findAllWorkerById(id: number): Promise<User[]>;
  abstract update(input: ShiftReport): Promise<ShiftReport>;
  abstract findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<ShiftReport[]>;
  abstract countAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number>;
}
