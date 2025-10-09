import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '@common/decorators/abilities.decorator';
import { ForbiddenError } from '@casl/ability';
import { PermissionException } from '@infra/exceptions/option.exceptions';
import { PERMISSION_DENIED_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    const ability =
      await this.caslAbilityFactory.createForPlatformManager(user);

    context.switchToHttp().getRequest().ability = ability;

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new PermissionException(PERMISSION_DENIED_EXCEPTION_CODE, error.message);
      }
    }
  }
}
