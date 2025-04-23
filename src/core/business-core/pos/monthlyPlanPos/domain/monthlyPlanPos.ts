import { BaseEntity } from '@utils/entity';

export interface MonthlyPlanPosProps {
  id?: number;
  posId: number;
  monthDate: Date;
  monthlyPlan: number;
}

export class MonthlyPlanPos extends BaseEntity<MonthlyPlanPosProps> {
  constructor(props: MonthlyPlanPosProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get posId(): number {
    return this.props.posId;
  }

  get monthlyPlan(): number {
    return this.props.monthlyPlan;
  }

  get monthDate(): Date {
    return this.props.monthDate;
  }

  set monthDate(monthDate: Date) {
    this.props.monthDate = monthDate;
  }

  set monthlyPlan(monthlyPlan: number) {
    this.props.monthlyPlan = monthlyPlan;
  }
}
