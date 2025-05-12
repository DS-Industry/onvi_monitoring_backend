import { BaseEntity } from '@utils/entity';
import { CurrencyType, CurrencyView } from '@prisma/client';

export interface CurrencyProps {
  id?: number;
  code: string;
  name: string;
  currencyType: CurrencyType;
  currencyView?: CurrencyView;
}

export class Currency extends BaseEntity<CurrencyProps> {
  constructor(props: CurrencyProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get currencyType(): CurrencyType {
    return this.props.currencyType;
  }

  get currencyView(): CurrencyView {
    return this.props.currencyView;
  }

  set code(code: string) {
    this.props.code = code;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set currencyType(currencyType: CurrencyType) {
    this.props.currencyType = currencyType;
  }

  set currencyView(currencyView: CurrencyView) {
    this.props.currencyView = currencyView;
  }
}
