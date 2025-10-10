export abstract class IS3Adapter {
  abstract getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
  abstract putPresignedUrl(key: string, expiresIn?: number): Promise<string>;
}
