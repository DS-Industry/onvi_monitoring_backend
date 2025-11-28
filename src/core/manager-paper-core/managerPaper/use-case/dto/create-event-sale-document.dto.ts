import { User } from '@platform-user/user/domain/user';

export class CreateEventSaleDocumentDto {
  posId: number;
  eventDate: Date;
  sum: number;
  user: User;
}
