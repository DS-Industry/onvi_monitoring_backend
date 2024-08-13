import { Injectable } from '@nestjs/common';
import { IDeviceOperationCardRepository } from '@device/device-operation-card/interface/device-operation-card';
import { DeviceOperationCardCreateDto } from '@device/device-operation-card/use-cases/dto/device-operation-card-create.dto';
import { DeviceOperationCard } from '@device/device-operation-card/domain/device-operation-card';

@Injectable()
export class CreateDeviceOperationCardUseCase {
  constructor(
    private readonly deviceOperationCardRepository: IDeviceOperationCardRepository,
  ) {}

  async execute(input: DeviceOperationCardCreateDto): Promise<void> {
    const deviceOperationCardData = new DeviceOperationCard({
      carWashDeviceId: input?.carWashDeviceId,
      operDate: input.operDate,
      loadDate: input.loadDate,
      cardNumber: input.cardNumber,
      discount: input.discount,
      sum: input.sum,
      localId: input.localId,
      operId: input.operId,
      discountSum: input.discountSum,
      totalSum: input?.totalSum,
      isBonus: input?.isBonus,
      currency: input.currency,
      cashback: input?.cashback,
      cashbackPercent: input?.cashbackPercent,
      errNumId: input?.errNumId,
    });

    await this.deviceOperationCardRepository.create(deviceOperationCardData);
  }
}
