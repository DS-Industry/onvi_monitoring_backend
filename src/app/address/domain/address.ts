import { BaseEntity } from '@utils/entity';

export interface AddressProps {
  id?: number;
  city: string;
  location: string;
  lat: number;
  lon: number;
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

  get lat(): number {
    return this.props.lat;
  }

  get lon(): number {
    return this.props.lon;
  }

  set city(city: string) {
    this.props.city = city;
  }

  set location(location: string) {
    this.props.location = location;
  }

  set lat(lat: number) {
    this.props.lat = lat;
  }

  set lon(lon: number) {
    this.props.lon = lon;
  }
}
