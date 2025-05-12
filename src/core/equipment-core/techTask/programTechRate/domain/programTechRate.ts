import { BaseEntity } from '@utils/entity';

export interface ProgramTechRateProps {
  id?: number;
  carWashPosId: number;
  carWashDeviceProgramsTypeId: number;
  literRate?: number;
  concentration?: number;
}

export class ProgramTechRate extends BaseEntity<ProgramTechRateProps> {
  constructor(props: ProgramTechRateProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashPosId(): number {
    return this.props.carWashPosId;
  }

  get carWashDeviceProgramsTypeId(): number {
    return this.props.carWashDeviceProgramsTypeId;
  }

  get literRate(): number {
    return this.props.literRate;
  }

  get concentration(): number {
    return this.props.concentration;
  }

  set literRate(literRate: number) {
    this.props.literRate = literRate;
  }

  set concentration(concentration: number) {
    this.props.concentration = concentration;
  }
}
