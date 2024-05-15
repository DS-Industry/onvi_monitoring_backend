export abstract class IMailAdapter {
  abstract send(email: string, subject: string, text: string): Promise<any>;
}
