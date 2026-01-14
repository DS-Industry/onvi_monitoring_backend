import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  IPosService,
  PingRequestDto,
  PingResponseDto,
  SendRequestDto,
  SendResponseDto,
  SendStatus,
} from './interface/pos.interface';

@Injectable()
export class PosService implements IPosService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly sourceCode: number;

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.DS_CLOUD_API_KEY || '';
    this.baseUrl = process.env.DS_CLOUD_BASE_URL || '';
    this.sourceCode = Number(process.env.DS_CLOUD_SOURCE_ID || 0);
  }

  async ping(data: PingRequestDto): Promise<PingResponseDto> {
    const headers = this.buildHeaders();
    try {
      const url =
        `${this.baseUrl}/external/collection/device/by-id?carwashId=${data.posId}&carWashDeviceId=${data.carWashDeviceId}`;

      const response = await firstValueFrom(this.httpService.get(url, { headers }));
      return {
        id: response.data.identifier,
        status: response.data.status,
        type: response.data.type,
        errorMessage: null,
      };
    } catch (error: any) {
      const errorData = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error?.message;
      return {
        id: null,
        status: 'Unavailable',
        type: null,
        errorMessage: errorData || 'Unknown error',
      };
    }
  }

  async send(data: SendRequestDto): Promise<SendResponseDto> {
    const headers = this.buildHeaders();
    try {
      const body = {
        GVLCardNum: data.cardNumber,
        GVLCardSum: data.sum,
        GVLSource: this.sourceCode,
      };

      const url = `${this.baseUrl}/external/mobile/write/${data.deviceId}`;

      await firstValueFrom(this.httpService.post(url, body, { headers }));
      return {
        sendStatus: SendStatus.SUCCESS,
        errorMessage: null,
      };
    } catch (error: any) {
      const errorData = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error?.message;
      return {
        sendStatus: SendStatus.FAIL,
        errorMessage: errorData || 'Unknown error',
      };
    }
  }

  private buildHeaders() {
    return { akey: this.apiKey } as Record<string, string>;
  }
}
