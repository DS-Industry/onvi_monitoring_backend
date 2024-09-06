import { Injectable } from '@nestjs/common';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { PosCreateDto } from '@platform-user/pos/controller/dto/pos-create.dto';
import { User } from '@platform-user/user/domain/user';
import { GetByIdOrganizationUseCase } from '@organization/organization/use-cases/organization-get-by-id';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';

@Injectable()
export class PreCreatePosUseCase {
  constructor(
    private readonly createPosUseCase: CreatePosUseCase,
    private readonly organizationGetById: GetByIdOrganizationUseCase,
  ) {}

  async execute(input: PosCreateDto, owner: User): Promise<PosResponseDto> {
    const organization = await this.organizationGetById.execute(
      input.organizationId,
    );
    if (owner.id !== organization.ownerId) {
      throw new Error('user not owner');
    }
    return await this.createPosUseCase.execute(input, owner);
  }
}
