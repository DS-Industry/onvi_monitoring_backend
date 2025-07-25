import { User } from '@platform-user/user/domain/user';

export class CreateEventDto {
  posId: number;
  eventDate: Date;
  sum: number;
  user: User;
  cashCollectionId: number;
}
