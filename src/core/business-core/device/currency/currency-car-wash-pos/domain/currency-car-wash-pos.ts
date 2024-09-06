import { BaseEntity } from '@utils/entity';

export interface CurrencyCarWashPosProps {
  id?: number;
  currencyId: number;
  carWashDeviceTypeId: number;
  coef: number;
  carWashPosId: number;
}

export class CurrencyCarWashPos extends BaseEntity<CurrencyCarWashPosProps> {
  constructor(props: CurrencyCarWashPosProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get currencyId(): number {
    return this.props.currencyId;
  }

  get carWashDeviceTypeId(): number {
    return this.props.carWashDeviceTypeId;
  }

  get coef(): number {
    return this.props.coef;
  }

  get carWashPosId(): number {
    return this.props.carWashPosId;
  }

  set coef(coef: number) {
    this.props.coef = coef;
  }
}
