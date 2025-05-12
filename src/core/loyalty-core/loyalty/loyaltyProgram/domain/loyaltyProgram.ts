import { BaseEntity } from '@utils/entity';
import { LoyaltyProgramStatus } from "@prisma/client";

export interface LoyaltyProgramProps {
  id?: number;
  name: string;
  status: LoyaltyProgramStatus;
  startDate: Date;
  lifetimeDays?: number;
}

export class LoyaltyProgram extends BaseEntity<LoyaltyProgramProps> {
  constructor(props: LoyaltyProgramProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): LoyaltyProgramStatus {
    return this.props.status;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get lifetimeDays(): number {
    return this.props.lifetimeDays;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set status(status: LoyaltyProgramStatus) {
    this.props.status = status;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  set lifetimeDays(lifetimeDays: number) {
    this.props.lifetimeDays = lifetimeDays;
  }
}
