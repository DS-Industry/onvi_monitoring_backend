import { Injectable } from '@nestjs/common';
import { AddWorkerOrganizationDto } from '@organization/organization/controller/dto/organization-add-worker.dto';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { GetByEmailUserUseCase } from '@platform-user/user/use-cases/user-get-by-email';
import { User } from '@platform-user/user/domain/user';
import { GetByIdOrganizationUseCase } from '@organization/organization/use-cases/organization-get-by-id';
import { SendOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-send';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class AddWorkerOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository,
    private readonly getByIdOrganizationUseCase: GetByIdOrganizationUseCase,
    private readonly sendOrganizationConfirmMailUseCase: SendOrganizationConfirmMailUseCase,
  ) {}

  async execute(input: AddWorkerOrganizationDto, owner: User): Promise<any> {
    const user = await this.userRepository.findOneByEmail(input.email);
    if (user) {
      throw new Error('user exists');
    }
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
