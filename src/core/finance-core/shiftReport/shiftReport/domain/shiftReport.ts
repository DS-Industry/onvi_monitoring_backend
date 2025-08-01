import { BaseEntity } from '@utils/entity';
import {
  StatusWorkDayShiftReport,
  TypeEstimation,
  TypeWorkDay,
} from '@prisma/client';

export interface ShiftReportProps {
  id?: number;
  posId?: number;
  workerId: number;
  workDate: Date;
  typeWorkDay: TypeWorkDay;
  timeWorkedOut?: string;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  status?: StatusWorkDayShiftReport;
  cashAtStart?: number;
  cashAtEnd?: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class ShiftReport extends BaseEntity<ShiftReportProps> {
  constructor(props: ShiftReportProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }
  get posId(): number {
    return this.props.posId;
  }
  get workerId(): number {
    return this.props.workerId;
  }

  get workDate(): Date {
    return this.props.workDate;
  }
  get typeWorkDay(): TypeWorkDay {
    return this.props.typeWorkDay;
  }
  set typeWorkDay(typeWorkDay: TypeWorkDay) {
    this.props.typeWorkDay = typeWorkDay;
  }
  get timeWorkedOut(): string {
    return this.props.timeWorkedOut;
  }
  set timeWorkedOut(timeWorkedOut: string) {
    this.props.timeWorkedOut = timeWorkedOut;
  }
  get startWorkingTime(): Date {
    return this.props.startWorkingTime;
  }
  get endWorkingTime(): Date {
    return this.props.endWorkingTime;
  }
  get estimation(): TypeEstimation {
    return this.props.estimation;
  }
  get status(): StatusWorkDayShiftReport {
    return this.props.status;
  }
  get cashAtStart(): number {
    return this.props.cashAtStart;
  }
  get cashAtEnd(): number {
    return this.props.cashAtEnd;
  }
  get comment(): string {
    return this.props.comment;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get createdById(): number {
    return this.props.createdById;
  }
  get updatedById(): number {
    return this.props.updatedById;
  }
  set posId(posId: number) {
    this.props.posId = posId;
  }
  set workDate(workDate: Date) {
    this.props.workDate = workDate;
  }
  set startWorkingTime(startWorkingTime: Date) {
    this.props.startWorkingTime = startWorkingTime;
  }
  set endWorkingTime(endWorkingTime: Date) {
    this.props.endWorkingTime = endWorkingTime;
  }
  set estimation(estimation: TypeEstimation) {
    this.props.estimation = estimation;
  }
  set status(status: StatusWorkDayShiftReport) {
    this.props.status = status;
  }
  set cashAtStart(cashAtStart: number) {
    this.props.cashAtStart = cashAtStart;
  }
  set cashAtEnd(cashAtEnd: number) {
    this.props.cashAtEnd = cashAtEnd;
  }
  set comment(comment: string) {
    this.props.comment = comment;
  }
  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
