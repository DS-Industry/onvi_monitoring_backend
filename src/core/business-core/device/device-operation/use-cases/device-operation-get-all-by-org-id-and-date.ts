import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';

import { DeviceOperation } from '@device/device-operation/domain/device-operation';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';

@Injectable()
export class DeviceOperationGetAllByOrgIdAndDateUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(input: OrganizationGetRatingDto): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByOrgIdAndDate(
      input.organizationId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
