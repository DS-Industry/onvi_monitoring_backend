import { Injectable } from '@nestjs/common';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { ClientCreateDto as CoreClientCreateDto } from '@loyalty/mobile-user/client/use-cases/dto/client-create.dto';
import { CreateClientDto } from '../controller/dto/client-create.dto';
import { ContractType } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class CreateClientUseCaseWrapper {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
  ) {}

  async execute(dto: CreateClientDto): Promise<any> {
    const coreCreateData: CoreClientCreateDto = {
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      gender: dto.gender,
      contractType: (dto.contractType ?? ContractType.INDIVIDUAL) as ContractType,
      comment: dto.comment,
      birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      placementId: dto.placementId,
    };

    return await this.createClientUseCase.execute(coreCreateData);
  }
}

