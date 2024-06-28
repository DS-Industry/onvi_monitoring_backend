import { Injectable } from '@nestjs/common';
import { ISmsAdapter } from '@libs/sms/adapter';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Otp } from '@mobile-user/otp/domain/otp';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import * as url from 'url';

@Injectable()
export class SmsService implements ISmsAdapter {
  private readonly urlSms: string;
  private readonly loginSms: string;
  private readonly passwordSms: string;
  private readonly senderSms: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.urlSms = configService.get<string>('smsUrl');
    this.loginSms = configService.get<string>('loginSms');
    this.passwordSms = configService.get<string>('passwordSms');
    this.senderSms = configService.get<string>('senderSms');
  }

  public async send(input: Otp, text: string): Promise<any> {
    const header: any = this.setHeaders();
    const params: string = this.setParams(
      text + input.confirmCode,
      input.phone,
    );
    try {
      return this.httpService
        .post(this.urlSms, params, header)
        .pipe(
          map((axiosResponse: AxiosResponse) => {
            return { message: 'Success', to: input.phone };
          }),
        )
        .subscribe((result) => {
          console.log(result); // Здесь выведется результат операции map
        });
    } catch (e) {
      throw new Error(`Error sending otp to ${input.phone}`);
    }
  }

  private setParams(message: string, target: string): string {
    const params = {
      user: this.loginSms,
      pass: this.passwordSms,
      action: 'post_sms',
      message: message,
      target: target,
      sender: this.senderSms,
    };

    return new url.URLSearchParams(params).toString();
  }

  private setHeaders(): {
    headers: { 'Content-Type': string; Accept: string };
  } {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/xml',
      },
    };
  }
}
