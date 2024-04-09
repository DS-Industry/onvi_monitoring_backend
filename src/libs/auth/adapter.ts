export abstract class IJwtAdapter {
  abstract signToken(model: any, secret: string, expiresIn: string): string;
  abstract validate(token: string): Promise<any>;
}
