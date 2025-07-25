import { Injectable } from '@nestjs/common';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { UserPermissionDataResponseDto } from '@platform-user/user/use-cases/dto/user-permission-data-response.dto';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { User } from "@platform-user/user/domain/user";

@Injectable()
export class OrganizationManageUserUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
  ) {}

  async execute(user: User): Promise<UserPermissionDataResponseDto[]> {
    const response: UserPermissionDataResponseDto[] = [];
    const uniqueUserIds = new Set<number>();

    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByUser(user);

    await Promise.all(
      organizations.map(async (org) => {
        const workers = await this.findMethodsUserUseCase.getAllByOrgId(org.id);

        workers.forEach((user) => {
          if (!uniqueUserIds.has(user.id)) {
            uniqueUserIds.add(user.id);
            response.push({
              id: user.id,
              name: user.name,
              surname: user.surname,
              middlename: user.middlename,
              organizationName: org.name,
              position: user.position,
              roleName: user.userRoleName,
              status: user.status,
              createAt: user.createdAt,
            });
          }
        });
      }),
    );

    return response;
  }
}
