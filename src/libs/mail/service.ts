import { Injectable } from '@nestjs/common';
import { IMailAdapter } from '@libs/mail/adapter';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class MailService implements IMailAdapter {
  private readonly emailApiKey: string;
  private readonly emailUrl: string;
  private readonly emailName: string;
  private readonly emailFrom: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.emailApiKey = this.configService.get<string>('emailApiKey');
    this.emailUrl = this.configService.get<string>('emailUrl');
    this.emailName = this.configService.get<string>('emailName');
    this.emailFrom = this.configService.get<string>('emailFrom');
  }

  async send(email: string, subject: string, text: string): Promise<any> {
    const header: any = this.setHeaders();
    const params = this.setParams(email, subject, text);
    try {
      // Возвращаем промис, который будет разрешен, когда придет ответ от сервера
      return new Promise((resolve, reject) => {
        this.httpService
          .post(this.emailUrl, params, header)
          .pipe(
            map(() => {
              return { message: 'Success', to: email };
            }),
          )
          .subscribe({
            next: (result) => {
              console.log(result); // Логируем результат внутри подписки
              resolve(result); // Разрешаем промис с результатом
            },
            error: (error) => {
              reject(error); // Отклоняем промис с ошибкой
            },
          });
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  private setHeaders(): {
    headers: { Authorization: string; 'content-type': string };
  } {
    return {
      headers: {
        Authorization: this.emailApiKey,
        'content-type': 'multipart/form-data',
      },
    };
  }

  private setParams(email: string, subject: string, text: string) {
    const params = new FormData();
    params.append('name', `${this.emailName}`);
    params.append('from', `${this.emailFrom}`);
    params.append('subject', `${subject}`);
    params.append('to', `${email}`);
    params.append(
      'html',
      `<html><head></head><body><p>${text}</p></body></html>`,
    );

    return params;
  }
}
