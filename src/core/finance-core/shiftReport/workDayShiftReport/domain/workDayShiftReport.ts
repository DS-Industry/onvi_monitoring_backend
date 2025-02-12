import { TypeEstimation, TypeWorkDay } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface WorkDayShiftReportProps {
  id?: number;
  shiftReportId: number;
  workerId: number;
  workDate: Date;
  typeWorkDay: TypeWorkDay;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  prize?: number;
  fine?: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class WorkDayShiftReport extends BaseEntity<WorkDayShiftReportProps> {
  constructor(props: WorkDayShiftReportProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }

  get shiftReportId(): number {
    return this.props.shiftReportId;
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

  get startWorkingTime(): Date {
    return this.props.startWorkingTime;
  }

  get endWorkingTime(): Date {
    return this.props.endWorkingTime;
  }

  get estimation(): TypeEstimation {
    return this.props.estimation;
  }

  get prize(): number {
    return this.props.prize;
  }

  get fine(): number {
    return this.props.fine;
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

  set typeWorkDay(typeWorkDay: TypeWorkDay) {
    this.props.typeWorkDay = typeWorkDay;
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

  set prize(prize: number) {
    this.props.prize = prize;
  }

  set fine(fine: number) {
    this.props.fine = fine;
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
