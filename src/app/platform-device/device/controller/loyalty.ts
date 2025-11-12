import { Controller, Post, Headers } from '@nestjs/common';
import { LoyaltyCardBalanceResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardBalance-response.dto';
import { LoyaltyCardOperResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardOper-response.dto';
import { OrderGetBalanceForDeviceUseCase } from '@loyalty/order/use-cases/order-get-balance-for-device';
import { DeviceValidateRules } from '@platform-device/validate/validate-rules/device-validate-rules';
import { OrderOperForDeviceUseCase } from '@loyalty/order/use-cases/order-oper-for-device';

@Controller('loyalty')
export class LoyaltyDeviceController {
  constructor(
    private readonly orderGetBalanceForDeviceUseCase: OrderGetBalanceForDeviceUseCase,
    private readonly orderOperForDeviceUseCase: OrderOperForDeviceUseCase,
    private readonly deviceValidateRules: DeviceValidateRules,
  ) {}

  @Post('card-balance')
  async cardBalance(
    @Headers('dev_id') deviceId: string,
    @Headers('token') token: string,
    @Headers('ucn') devNumber: string,
  ): Promise<string> {
    try {
      const pos = await this.deviceValidateRules.cardBalanceValidate(
        Number(deviceId),
      );
      const responseData: LoyaltyCardBalanceResponseDto =
        await this.orderGetBalanceForDeviceUseCase.execute(pos, devNumber);
      return this.formatBalanceToString(responseData);
    } catch (e) {
      const err: LoyaltyCardBalanceResponseDto = {
        errcode: 5,
        balance: 0,
        discount: 0,
        cashback: 0,
      };
      return this.formatBalanceToString(err);
    }
  }

  @Post('card-oper')
  async cardOper(
    @Headers('dev_id') deviceId: string,
    @Headers('token') token: string,
    @Headers('ucn') devNumber: string,
    @Headers('sum') sum: string,
  ): Promise<string> {
    try {
      const pos = await this.deviceValidateRules.cardBalanceValidate(
        Number(deviceId),
      );
      const responseData: LoyaltyCardOperResponseDto =
        await this.orderOperForDeviceUseCase.execute(
          pos,
          Number(deviceId),
          devNumber,
          Number(sum),
        );
      return this.formatOperToString(responseData);
    } catch (e) {
      const err: LoyaltyCardOperResponseDto = {
        errcode: 2,
        errmes: 'Unexpected error',
        balance: 0,
        oper_id: 0,
      };
      return this.formatOperToString(err);
    }
  }

  private formatBalanceToString(dto: LoyaltyCardBalanceResponseDto): string {
    const lf = String.fromCharCode(10);

    return (
      `{${lf}` +
      `"errcode":${dto.errcode},${lf}` +
      `"balance":${dto.balance},${lf}` +
      `"discount":${dto.discount ?? 0},${lf}` +
      `"cashback":${dto.cashback ?? 0}${lf}` +
      `}`
    );
  }

  private formatOperToString(dto: LoyaltyCardOperResponseDto): string {
    const lf = String.fromCharCode(10);

    return (
      `{${lf}` +
      `"errcode":${dto.errcode},${lf}` +
      `"errmes":"${dto.errmes}",${lf}` +
      `"balance":${dto.balance ?? 0},${lf}` +
      `"oper_id":${dto.oper_id ?? 0}${lf}` +
      `}`
    );
  }
}
