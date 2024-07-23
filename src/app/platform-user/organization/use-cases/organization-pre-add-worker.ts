import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { AddWorkerOrganizationUseCase } from '@organization/organization/use-cases/organization-add-worker';
import { AddWorkerOrganizationDto } from '@platform-user/organization/controller/dto/organization-add-worker.dto';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class PreAddWorkerOrganizationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly organizationAddWorker: AddWorkerOrganizationUseCase,
  ) {}

  async execute(input: AddWorkerOrganizationDto, owner: User): Promise<any> {
    const user = await this.userRepository.findOneByEmail(input.email);
    if (user) {
      throw new Error('user exists');
    }
    return await this.organizationAddWorker.execute(input, owner);
  }
}
