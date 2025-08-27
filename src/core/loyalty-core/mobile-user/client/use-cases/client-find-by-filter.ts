import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ClientFilterDto } from '@loyalty/mobile-user/client/use-cases/dto/client-filter.dto';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { ClientPaginatedResponseDto } from '@platform-user/core-controller/dto/response/client-paginated-response.dto';
import { ContractType } from '@prisma/client';

@Injectable()
export class FindByFilterClientUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
  ) {}

  async execute(data: ClientFilterDto): Promise<ClientPaginatedResponseDto> {
    let placementId: number | undefined = undefined;
    let contractType: ContractType | undefined = undefined;
    let workerCorporateId: number | undefined = undefined;
    let organizationId: number | undefined = undefined;
    
    if (data.placementId !== '*' && data.placementId !== null && data.placementId !== undefined) {
      placementId = Number(data.placementId);
      if (isNaN(placementId)) {
        placementId = undefined;
      }
    }
    
    if (data.contractType !== '*' && data.contractType !== null && data.contractType !== undefined) {
      contractType = data.contractType;
    }
    
    if (data.workerCorporateId !== '*' && data.workerCorporateId !== null && data.workerCorporateId !== undefined) {
      workerCorporateId = Number(data.workerCorporateId);
      if (isNaN(workerCorporateId)) {
        workerCorporateId = undefined;
      }
    }

     
    if (data.organizationId !== '*' && data.organizationId !== null && data.organizationId !== undefined) {
      organizationId = Number(data.organizationId);
      if (isNaN(organizationId)) {
        organizationId = undefined;
      }
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
      organizationId,
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
      organizationId,
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
