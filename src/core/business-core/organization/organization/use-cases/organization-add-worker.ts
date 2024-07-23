import { Injectable } from '@nestjs/common';
import { AddWorkerOrganizationDto } from '@platform-user/organization/controller/dto/organization-add-worker.dto';
import { IOrganizationRepository } from '../interfaces/organization';
import { GetByEmailUserUseCase } from '@platform-user/user/use-cases/user-get-by-email';
import { User } from '@platform-user/user/domain/user';
import { GetByIdOrganizationUseCase } from './organization-get-by-id';
import { SendOrganizationConfirmMailUseCase } from '../../confirmMail/use-case/confirm-mail-send';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class AddWorkerOrganizationUseCase {
  constructor(
    private readonly getByIdOrganizationUseCase: GetByIdOrganizationUseCase,
    private readonly sendOrganizationConfirmMailUseCase: SendOrganizationConfirmMailUseCase,
  ) {}

  async execute(input: AddWorkerOrganizationDto, owner: User): Promise<any> {
    const organization = await this.getByIdOrganizationUseCase.execute(
      input.organizationId,
    );
    if (organization.ownerId !== owner.id) {
      throw new Error('organization not exists');
    }
    return await this.sendOrganizationConfirmMailUseCase.execute(
      input.email,
      'Приглашение в организацию:',
      organization.id,
    );
  }
}
