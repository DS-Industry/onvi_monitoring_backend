export abstract class IFirebaseAdapter {
  abstract sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void>;
  abstract sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void>;
}
