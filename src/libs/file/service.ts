import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService implements IFileAdapter {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: 'storage.yandexcloud.net',
    });
  }

  async upload(file: Express.Multer.File, key: string): Promise<string> {
    const params = {
      Bucket: this.configService.get<string>('bucketName'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await this.s3.upload(params).promise();
    return data.Location;
  }

  async download(key: string): Promise<any> {
    const params = {
      Bucket: this.configService.get<string>('bucketName'),
      Key: key,
    };

    const data = await this.s3.getObject(params).promise();
    return data.Body as Buffer;
  }
}
