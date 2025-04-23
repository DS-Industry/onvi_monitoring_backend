import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ClientResponseDto } from '@platform-user/core-controller/dto/response/client-response.dto';
import { ClientFilterDto } from '@loyalty/mobile-user/client/use-cases/dto/client-filter.dto';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';

@Injectable()
export class FindByFilterClientUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
  ) {}

  async execute(data: ClientFilterDto): Promise<ClientResponseDto[]> {
    let placementId = undefined;
    let type = undefined;
    if (data.placementId != '*') {
      placementId = data.placementId;
    }
    if (data.type != '*') {
      type = data.type;
    }
    const clients = await this.findMethodsClientUseCase.getAllByFilter(
      placementId,
      data.tagIds,
      type,
      data?.phone,
      data?.skip,
      data?.take,
    );

    return await Promise.all(
      clients.map(async (client) => {
        const tags = await this.findMethodsTagUseCase.getAllByClientId(
          client.id,
        );
        return {
          id: client.id,
          name: client.name,
          phone: client.phone,
          type: client.type,
          status: client.status,
          comment: client.comment,
          placementId: client.placementId,
          tags: tags.map((tag) => tag.getProps()),
        };
      }),
    );
  }
}
