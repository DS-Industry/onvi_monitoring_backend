import { BaseEntity } from '@utils/entity';

export interface PosPositionSalaryRateProps {
  id?: number;
  posId: number;
  hrPositionId: number;
  baseRateDay?: number | null;
  bonusRateDay?: number | null;
  baseRateNight?: number | null;
  bonusRateNight?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PosPositionSalaryRate extends BaseEntity<PosPositionSalaryRateProps> {
  constructor(props: PosPositionSalaryRateProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get posId(): number {
    return this.props.posId;
  }

  get hrPositionId(): number {
    return this.props.hrPositionId;
  }

  get baseRateDay(): number | null | undefined {
    return this.props.baseRateDay;
  }

  get bonusRateDay(): number | null | undefined {
    return this.props.bonusRateDay;
  }

  get baseRateNight(): number | null | undefined {
    return this.props.baseRateNight;
  }

  get bonusRateNight(): number | null | undefined {
    return this.props.bonusRateNight;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set baseRateDay(value: number | null | undefined) {
    this.props.baseRateDay = value;
  }

  set bonusRateDay(value: number | null | undefined) {
    this.props.bonusRateDay = value;
  }

  set baseRateNight(value: number | null | undefined) {
    this.props.baseRateNight = value;
  }

  set bonusRateNight(value: number | null | undefined) {
    this.props.bonusRateNight = value;
  }
}

