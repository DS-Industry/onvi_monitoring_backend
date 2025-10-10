export class PresignedUrlResponseDto {
  url: string;
  key: string;
  expiresIn: number;
  expiresAt: Date;

  constructor(url: string, key: string, expiresIn: number) {
    this.url = url;
    this.key = key;
    this.expiresIn = expiresIn;
    this.expiresAt = new Date(Date.now() + expiresIn * 1000);
  }
}
