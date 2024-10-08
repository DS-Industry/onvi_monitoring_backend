import { Injectable } from '@nestjs/common';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { UserPermissionDataResponseDto } from '@platform-user/user/use-cases/dto/user-permission-data-response.dto';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';

@Injectable()
export class OrganizationManageUserUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
  ) {}

  async execute(ability: any): Promise<UserPermissionDataResponseDto[]> {
    const response: UserPermissionDataResponseDto[] = [];
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByAbility(ability);
    await Promise.all(
      organizations.map(async (org) => {
        const worker = await this.findMethodsOrganizationUseCase.getAllWorker(
          org.id,
        );
        await Promise.all(
          worker.map(async (user) => {
            const role = await this.findMethodsRoleUseCase.getById(
              user.userRoleId,
            );
            const existingUserIndex = response.findIndex(
              (existingUser) => existingUser.id === user.id,
            );
            if (existingUserIndex === -1) {
              response.push({
                id: user.id,
                name: user.name,
                surname: user.surname,
                middlename: user.middlename,
                organizationName: org.name,
                position: user.position,
                roleName: role.name,
                status: user.status,
                createAt: user.createdAt,
              });
            }
          }),
        );
      }),
    );
    return response;
  }
}
