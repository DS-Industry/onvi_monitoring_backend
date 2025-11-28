import { ManagerReportPeriodStatus } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ManagerReportPeriodProps {
  id?: number;
  status: ManagerReportPeriodStatus;
  startPeriod: Date;
  endPeriod: Date;
  sumStartPeriod: number;
  sumEndPeriod: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  createdById?: number;
  updatedById?: number;
}

export class ManagerReportPeriod extends BaseEntity<ManagerReportPeriodProps> {
  constructor(props: ManagerReportPeriodProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get status(): ManagerReportPeriodStatus {
    return this.props.status;
  }

  set status(status: ManagerReportPeriodStatus) {
    this.props.status = status;
  }

  get startPeriod(): Date {
    return this.props.startPeriod;
  }

  set startPeriod(startPeriod: Date) {
    this.props.startPeriod = startPeriod;
  }

  get endPeriod(): Date {
    return this.props.endPeriod;
  }

  set endPeriod(endPeriod: Date) {
    this.props.endPeriod = endPeriod;
  }

  get sumStartPeriod(): number {
    return this.props.sumStartPeriod;
  }

  set sumStartPeriod(sumStartPeriod: number) {
    this.props.sumStartPeriod = sumStartPeriod;
  }

  get sumEndPeriod(): number {
    return this.props.sumEndPeriod;
  }

  set sumEndPeriod(sumEndPeriod: number) {
    this.props.sumEndPeriod = sumEndPeriod;
  }

  get userId(): number {
    return this.props.userId;
  }

  set userId(userId: number) {
    this.props.userId = userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  set createdById(createdById: number) {
    this.props.createdById = createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
