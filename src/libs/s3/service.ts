import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IS3Adapter } from './adapter';

@Injectable()
export class S3Service implements IS3Adapter {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('endpointFile');
    const formattedEndpoint = endpoint?.startsWith('http') ? endpoint : `https://${endpoint}`;
    
    this.s3Client = new S3Client({
      region: 'ru-central1', 
      endpoint: formattedEndpoint,
      credentials: {
        accessKeyId: this.configService.get<string>('awsAccessKeyId'),
        secretAccessKey: this.configService.get<string>('awsSecretAccessKey'),
      },
      forcePathStyle: true,
    });
    
    this.bucketName = this.configService.get<string>('bucketName');
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async putPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
