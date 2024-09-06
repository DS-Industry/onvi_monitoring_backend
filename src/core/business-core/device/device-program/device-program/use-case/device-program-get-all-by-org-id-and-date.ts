import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';

@Injectable()
export class GetAllByOrgIdAndDateDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(input: OrganizationGetRatingDto): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByOrgIdAndDate(
      input.organizationId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
