import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ClientResponseDto } from '@platform-user/core-controller/dto/response/client-response.dto';
import { ClientFilterDto } from '@loyalty/mobile-user/client/use-cases/dto/client-filter.dto';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { ClientPaginatedResponseDto } from '@platform-user/core-controller/dto/response/client-paginated-response.dto';

@Injectable()
export class FindByFilterClientUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
  ) {}

  async execute(data: ClientFilterDto): Promise<ClientPaginatedResponseDto> {
    let placementId = undefined;
    let contractType = undefined;
    let workerCorporateId = undefined;
    if (data.placementId != '*') {
      placementId = data.placementId;
    }
    if (data.contractType != '*') {
      contractType = data.contractType;
    }
    if (data.workerCorporateId != '*') {
      workerCorporateId = data.workerCorporateId;
    }

    const total = await this.findMethodsClientUseCase.getCountByFilter(
      placementId,
      data.tagIds,
      contractType,
      workerCorporateId,
      data?.phone,
      data?.registrationFrom,
      data?.registrationTo,
      data?.search,
    );

    const clients = await this.findMethodsClientUseCase.getAllByFilter(
      placementId,
      data.tagIds,
      contractType,
      workerCorporateId,
      data?.phone,
      data?.skip,
      data?.take,
      data?.registrationFrom,
      data?.registrationTo,
      data?.search,
    );

    const clientData = await Promise.all(
      clients.map(async (client) => {
        const tags = await this.findMethodsTagUseCase.getAllByClientId(
          client.id,
        );
        return {
          id: client.id,
          name: client.name,
          phone: client.phone,
          contractType: client.contractType,
          status: client.status,
          comment: client.comment,
          placementId: client.placementId,
          tags: tags.map((tag) => tag.getProps()),
        };
      }),
    );

    const page = data.page || 1;
    const size = data.size || total;
    const totalPages = size > 0 ? Math.ceil(total / size) : 1;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: clientData,
      total,
      page,
      size,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }
}
