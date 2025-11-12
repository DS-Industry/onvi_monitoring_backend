export class CreateDto {
  heading: string;
  body: string;
  userIds: number[];
  fcmTokens: string[];
  authorId?: number;
}
