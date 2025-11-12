export class EventHandlerDto {
  eventType: string;
  heading: string;
  body: string;
  userIds: number[];
  fcmTokens: [];
  authorId?: number;
}
