import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { PosController } from '@platform-user/pos/controller/pos';
import { UserModule } from '@platform-user/user/user.module';
import { AbilityModule } from '@platform-user/permissions/ability.module';
import { PosValidateRules } from '@platform-user/pos/controller/validate/pos-validate-rules';

@Module({
  imports: [UserModule, BusinessCoreModule, AbilityModule],
  controllers: [PosController],
  providers: [PosValidateRules],
})
export class PlatformUserPosModule {}
