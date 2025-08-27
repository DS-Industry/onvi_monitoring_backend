import { Injectable } from '@nestjs/common';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { UserPermissionDataResponseDto } from '@platform-user/user/use-cases/dto/user-permission-data-response.dto';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { User } from '@platform-user/user/domain/user';
import { Organization } from '@organization/organization/domain/organization';

@Injectable()
export class OrganizationManageUserUseCase {
  constructor(
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
  ) {}

  async execute(
    organization: Organization,
    skip?: number,
    take?: number,
  ): Promise<UserPermissionDataResponseDto[]> {
    const response: UserPermissionDataResponseDto[] = [];

    const workers = await this.findMethodsUserUseCase.getAllByOrgId(
      organization.id,
      skip,
      take,
    );

    workers.forEach((user) => {
      response.push({
        id: user.id,
        name: user.name,
        surname: user.surname,
        middlename: user.middlename,
        organizationName: organization.name,
        position: user.position,
        roleName: user.userRoleName,
        status: user.status,
        createAt: user.createdAt,
      });
    });

    return response;
  }
}
