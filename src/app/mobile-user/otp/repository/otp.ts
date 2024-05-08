import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { PrismaService } from '@db/prisma/prisma.service';
import { Otp } from '@mobile-user/otp/domain/otp';
import { PrismaOtpMapper } from '@db/mapper/prisma-otp-mapper';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as url from 'url';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

@Injectable()
export class OtpRepository extends IOtpRepository {
  private urlSms: string;
  private loginSms: string;
  private passwordSms: string;
  private senderSms: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.urlSms = configService.get<string>('smsUrl');
    this.loginSms = configService.get<string>('loginSms');
    this.passwordSms = configService.get<string>('passwordSms');
    this.senderSms = configService.get<string>('senderSms');
  }

  public async create(input: Otp): Promise<Otp> {
    const otpPrismaEntity = PrismaOtpMapper.toPrisma(input);
    const otp = await this.prisma.otp.create({
      data: otpPrismaEntity,
    });
    return PrismaOtpMapper.toDomain(otp);
  }

  public async findOne(phone: string): Promise<Otp> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        phone,
      },
    });
    return PrismaOtpMapper.toDomain(otp);
  }

  public async removeOne(phone: string): Promise<void> {
    await this.prisma.otp.delete({
      where: {
        phone,
      },
    });
  }

  public async send(input: Otp): Promise<any> {
    const header: any = this.setHeaders();
    const params: string = this.setParams(
      'Ваш код доступа: ' + input.confirmCode,
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
