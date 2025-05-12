import { BaseEntity } from '@utils/entity';

export interface PlacementProps {
  id?: number;
  country: string;
  region: string;
  city: string;
  utc: string;
}

export class Placement extends BaseEntity<PlacementProps> {
  constructor(props: PlacementProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }
  get country(): string {
    return this.props.country;
  }
  get region(): string {
    return this.props.region;
  }
  get city(): string {
    return this.props.city;
  }
  get utc(): string {
    return this.props.utc;
  }
}
