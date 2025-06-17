import { BaseEntity } from '@utils/entity';

export interface AddressProps {
  id?: number;
  city: string;
  location: string;
  lat?: string;
  lon?: string;
}

export class Address extends BaseEntity<AddressProps> {
  constructor(props: AddressProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get city(): string {
    return this.props.city;
  }

  get location(): string {
    return this.props.location;
  }

  get lat(): string {
    return this.props.lat;
  }

  get lon(): string {
    return this.props.lon;
  }

  set city(city: string) {
    this.props.city = city;
  }

  set location(location: string) {
    this.props.location = location;
  }

  set lat(lat: string) {
    this.props.lat = lat;
  }

  set lon(lon: string) {
    this.props.lon = lon;
  }
}
