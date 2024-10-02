import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';
import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';

@Injectable()
export class FindMethodsOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly addressGetByIdUseCase: GetByIdAddressUseCase,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async getById(input: number): Promise<any> {
    return await this.organizationRepository.findOneById(input);
  }

  async getByName(input: string): Promise<any> {
    return await this.organizationRepository.findOneByName(input);
  }

  async getBySlug(input: string): Promise<any> {
    return await this.organizationRepository.findOneBySlug(input);
  }

  async getAllByOwner(input: number): Promise<Organization[]> {
    return await this.organizationRepository.findAllByOwner(input);
  }

  async getAllByUser(input: number): Promise<Organization[]> {
    return await this.organizationRepository.findAllByUser(input);
  }

  async getAllWorker(input: number): Promise<User[]> {
    return await this.organizationRepository.findAllUser(input);
  }

  async getAllPos(input: number): Promise<PosResponseDto[]> {
    const poses = await this.organizationRepository.findAllPos(input);
    return await Promise.all(
      poses.map(
        async (item) => await this.posCreateFullDataUseCase.execute(item),
      ),
    );
  }
}
