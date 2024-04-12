import { BaseEntity } from '@utils/entity';


export interface AdminProps {
  id?: number;
  name: string;
  surname: string;
  middlename: string;
  birthday?: Date;
  phone: string;
  email: string;
  password: string;
  gender: string;
  status?: any;
  avatar?: string;
  country?: string;
  countryCode?: number;
  timezone?: number;
  refreshTokenId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Admin extends BaseEntity<AdminProps> {
  constructor(props: AdminProps) {
    super(props);
  }
}
