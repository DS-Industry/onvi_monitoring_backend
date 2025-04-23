import { TypeWorkDayShiftReportCashOper } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface WorkDayShiftReportCashOperProps {
  id?: number;
  workDayShiftReportId: number;
  carWashDeviceId?: number;
  eventDate?: Date;
  type: TypeWorkDayShiftReportCashOper;
  sum: number;
  comment?: string;
}

export class WorkDayShiftReportCashOper extends BaseEntity<WorkDayShiftReportCashOperProps> {
  constructor(props: WorkDayShiftReportCashOperProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get workDayShiftReportId(): number {
    return this.props.workDayShiftReportId;
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
