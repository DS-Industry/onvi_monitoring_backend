import { TypeWorkDayShiftReportCashOper } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ShiftReportCashOperProps {
  id?: number;
  shiftReportId: number;
  carWashDeviceId?: number;
  eventDate?: Date;
  type: TypeWorkDayShiftReportCashOper;
  sum: number;
  comment?: string;
}

export class ShiftReportCashOper extends BaseEntity<ShiftReportCashOperProps> {
  constructor(props: ShiftReportCashOperProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get shiftReportId(): number {
    return this.props.shiftReportId;
  }

  get eventDate(): Date {
    return this.props.eventDate;
  }

  get type(): TypeWorkDayShiftReportCashOper {
    return this.props.type;
  }

  get sum(): number {
    return this.props.sum;
  }

  get comment(): string {
    return this.props.comment;
  }
}
