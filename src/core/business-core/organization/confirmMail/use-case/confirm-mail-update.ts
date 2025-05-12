import { Injectable } from '@nestjs/common';
import { IOrganizationConfirmMailRepository } from '@organization/confirmMail/interfaces/confirmMail';
import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';
import { StatusDeviceDataRaw } from '@prisma/client';

@Injectable()
export class UpdateConfirmMailUseCase {
  constructor(
    private readonly organizationConfirmRepository: IOrganizationConfirmMailRepository,
  ) {}

  async execute(organizationConfirmMail: OrganizationConfirmMail) {
    organizationConfirmMail.status = StatusDeviceDataRaw.DONE;

    return await this.organizationConfirmRepository.update(
      organizationConfirmMail,
    );
  }
}
