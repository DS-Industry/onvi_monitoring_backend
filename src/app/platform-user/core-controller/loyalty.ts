import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateLoyaltyAbility,
  ReadLoyaltyAbility,
  UpdateLoyaltyAbility,
} from '@common/decorators/abilities.decorator';
import { TagCreateDto } from '@platform-user/core-controller/dto/receive/tag-create.dto';
import { LoyaltyException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { LoyaltyValidateRules } from '@platform-user/validate/validate-rules/loyalty-validate-rules';
import { CreateTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-create';
import { DeleteTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-delete';
import { ClientCreateDto } from '@platform-user/core-controller/dto/receive/client-create.dto';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { ClientFullResponseDto } from '@platform-user/core-controller/dto/response/client-full-response.dto';
import { ClientFilterDto } from '@platform-user/core-controller/dto/receive/client-filter.dto';
import { ClientResponseDto } from '@platform-user/core-controller/dto/response/client-response.dto';
import { FindByFilterClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-by-filter';
import { ClientUpdateDto } from '@platform-user/core-controller/dto/receive/client-update.dto';
import { UpdateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-update';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { LoyaltyProgramCreateDto } from '@platform-user/core-controller/dto/receive/loyaltyProgram-create.dto';
import { CreateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-create';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { CreateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-create';
import { LoyaltyTierCreateDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-create.dto';
import { LoyaltyTierUpdateDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-update.dto';
import { UpdateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-update';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';
import { BenefitActionCreateDto } from '@platform-user/core-controller/dto/receive/benefitAction-create.dto';
import { CreateBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-create';
import { FindMethodsBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-find-methods';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';
import { CreateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-create';
import { BenefitCreateDto } from '@platform-user/core-controller/dto/receive/benefit-create.dto';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';
import { LoyaltyTierFilterDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-filter.dto';
import { LoyaltyTierGetOneResponseDto } from '@platform-user/core-controller/dto/response/loyaltyTier-get-one-response.dto';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { LoyaltyProgramGetByIdResponseDto } from '@platform-user/core-controller/dto/response/loyaltyProgram-get-by-id-response.dto';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { OrderCreateDto } from '@platform-user/core-controller/dto/receive/orderCreate';
import { UpdateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-update';
import { BenefitUpdateDto } from '@platform-user/core-controller/dto/receive/benefit-update.dto';
import { GetBenefitsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-get-benefits';
import { CardBenefitDataDto } from '@loyalty/mobile-user/card/use-case/dto/card-benefit-data.dto';
import { ExpirationCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-expiration';
import { UpdateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-update';
import { LoyaltyProgramUpdateDto } from '@platform-user/core-controller/dto/receive/loyaltyProgram-update.dto';
import { CardsFilterDto } from './dto/receive/cards.filter.dto';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { ClientKeyStatsDto } from './dto/receive/client-key-stats.dto';
import { UserKeyStatsResponseDto } from './dto/response/user-key-stats-response.dto';

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private readonly createLoyaltyProgramUseCase: CreateLoyaltyProgramUseCase,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
    private readonly createLoyaltyTierUseCase: CreateLoyaltyTierUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly findByFilterClientUseCase: FindByFilterClientUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
    private readonly updateLoyaltyTierUseCase: UpdateLoyaltyTierUseCase,
    private readonly createBenefitUseCase: CreateBenefitUseCase,
    private readonly createBenefitActionUseCase: CreateBenefitActionUseCase,
    private readonly findMethodsBenefitActionUseCase: FindMethodsBenefitActionUseCase,
    private readonly findMethodsBenefitUseCase: FindMethodsBenefitUseCase,
    private readonly loyaltyValidateRules: LoyaltyValidateRules,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly handlerOrderUseCase: HandlerOrderUseCase,
    private readonly updateBenefitUseCase: UpdateBenefitUseCase,
    private readonly getBenefitsCardUseCase: GetBenefitsCardUseCase,
    private readonly expirationCardBonusBankUseCase: ExpirationCardBonusBankUseCase,
    private readonly updateLoyaltyProgramUseCase: UpdateLoyaltyProgramUseCase,
  ) {}
  @Post('test-oper')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async testOper(
    @Request() req: any,
    //@Body() data: CardBonusOperCreateDto,
  ): Promise<any> {
    try {
      /*const { user, ability } = req;
      const card = await this.loyaltyValidateRules.testOperValidate(
        data.typeOperId,
        data.cardMobileUserId,
        data?.carWashDeviceId,
      );
      return await this.createCardBonusOperUseCase.execute(
        { ...data, creatorId: user.id },
        card,
      );*/
      return await this.expirationCardBonusBankUseCase.execute();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post('test-order')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async testOrder(
    @Request() req: any,
    @Body() data: OrderCreateDto,
  ): Promise<any> {
    try {
      return await this.handlerOrderUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create program
  @Post('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createPrograms(
    @Request() req: any,
    @Body() data: LoyaltyProgramCreateDto,
  ): Promise<LoyaltyProgram> {
    try {
      const { ability, user } = req;
      await this.loyaltyValidateRules.createLoyaltyProgramValidate(
        data.organizationIds,
        ability,
      );
      return await this.createLoyaltyProgramUseCase.execute(
        {
          name: data.name,
          organizationIds: data.organizationIds,
          lifetimeDays: data?.lifetimeDays,
        },
        user,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update program
  @Patch('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updatePrograms(
    @Request() req: any,
    @Body() data: LoyaltyProgramUpdateDto,
  ): Promise<LoyaltyProgram> {
    try {
      const { ability } = req;
      const loyaltyProgram =
        await this.loyaltyValidateRules.updateLoyaltyProgramValidate(
          data.loyaltyProgramId,
          ability,
          data?.organizationIds,
        );
      const organizations =
        await this.findMethodsOrganizationUseCase.getAllByLoyaltyProgramId(
          loyaltyProgram.id,
        );
      return await this.updateLoyaltyProgramUseCase.execute(
        data,
        loyaltyProgram,
        organizations,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('programs')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getPrograms(
    @Request() req: any,
    @Query('organizationId') organizationId?: string,
  ): Promise<LoyaltyProgram[]> {
    try {
      const { ability } = req;

      return await this.findMethodsLoyaltyProgramUseCase.getAllByAbility(
        ability,
        organizationId ? Number(organizationId) : undefined,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  //Get program by id
  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getProgram(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyProgramGetByIdResponseDto> {
    try {
      const { ability } = req;
      const loyaltyProgram =
        await this.loyaltyValidateRules.getLoyaltyProgramValidate(id, ability);
      const organizations =
        await this.findMethodsOrganizationUseCase.getAllByLoyaltyProgramId(
          loyaltyProgram.id,
        );

      return {
        id: loyaltyProgram.id,
        name: loyaltyProgram.name,
        status: loyaltyProgram.status,
        startDate: loyaltyProgram.startDate,
        organizations: organizations.map((item) => {
          return { id: item.id, name: item.name };
        }),
        lifetimeDays: loyaltyProgram?.lifetimeDays,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create tier
  @Post('tier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createTier(
    @Request() req: any,
    @Body() data: LoyaltyTierCreateDto,
  ): Promise<LoyaltyTier> {
    try {
      const { ability } = req;
      await this.loyaltyValidateRules.createLoyaltyTierValidate(
        data.loyaltyProgramId,
        ability,
      );
      return await this.createLoyaltyTierUseCase.execute(
        data.name,
        data.loyaltyProgramId,
        data.limitBenefit,
        data?.description,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update tier
  @Patch('tier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updateTier(@Body() data: LoyaltyTierUpdateDto): Promise<LoyaltyTier> {
    try {
      const loyaltyTier =
        await this.loyaltyValidateRules.updateLoyaltyTierValidate(
          data.loyaltyTierId,
          data?.benefitIds,
        );
      return await this.updateLoyaltyTierUseCase.execute(data, loyaltyTier);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get tiers by filter
  @Get('tiers')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getTiers(
    @Request() req: any,
    @Query() data: LoyaltyTierFilterDto,
  ): Promise<LoyaltyTierGetOneResponseDto[]> {
    try {
      const { ability } = req;
      let tiers: LoyaltyTier[];
      if (data.programId == '*') {
        const programs =
          await this.findMethodsLoyaltyProgramUseCase.getAllByAbility(ability);
        const programsIds = programs.map((program) => program.id);
        tiers =
          await this.findMethodsLoyaltyTierUseCase.getAllByLoyaltyProgramIds(
            programsIds,
          );
      } else {
        await this.loyaltyValidateRules.getLoyaltyProgramValidate(
          data.programId,
          ability,
        );
        tiers =
          await this.findMethodsLoyaltyTierUseCase.getAllByLoyaltyProgramId(
            data.programId,
          );
      }
      return await Promise.all(
        tiers.map(async (tier) => {
          const benefits =
            await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(tier.id);
          const benefitIds = benefits.map((benefit) => benefit.id);

          return {
            id: tier.id,
            name: tier.name,
            description: tier.description,
            loyaltyProgramId: tier.loyaltyProgramId,
            limitBenefit: tier.limitBenefit,
            benefitIds: benefitIds,
          };
        }),
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get tier by id
  @Get('tier/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getTier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyTierGetOneResponseDto> {
    try {
      const loyaltyTier =
        await this.loyaltyValidateRules.getLoyaltyTierValidate(id);
      const benefits =
        await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(id);
      const benefitIds = benefits.map((benefit) => benefit.id);
      return {
        id: loyaltyTier.id,
        name: loyaltyTier.name,
        description: loyaltyTier.description,
        loyaltyProgramId: loyaltyTier.loyaltyProgramId,
        limitBenefit: loyaltyTier.limitBenefit,
        benefitIds: benefitIds,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create benefit
  @Post('benefit')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createBenefit(@Body() data: BenefitCreateDto): Promise<Benefit> {
    try {
      if (data.benefitActionTypeId) {
        await this.loyaltyValidateRules.createBenefitValidate(
          data.benefitActionTypeId,
        );
      }
      return await this.createBenefitUseCase.execute(
        data.name,
        data.bonus,
        data.type,
        data?.benefitActionTypeId,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update benefit
  @Patch('benefit')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updateBenefit(@Body() data: BenefitUpdateDto): Promise<Benefit> {
    try {
      const benefit = await this.loyaltyValidateRules.getBenefitByIdValidate(
        data.benefitId,
      );
      return await this.updateBenefitUseCase.execute(data, benefit);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get benefit by id
  @Get('benefit/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefit(@Param('id', ParseIntPipe) id: number): Promise<Benefit> {
    try {
      return await this.loyaltyValidateRules.getBenefitByIdValidate(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all benefits
  @Get('benefits')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefits(): Promise<Benefit[]> {
    try {
      return await this.findMethodsBenefitUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create benefitAction
  @Post('benefit-action')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createBenefitAction(
    @Body() data: BenefitActionCreateDto,
  ): Promise<BenefitAction> {
    try {
      return await this.createBenefitActionUseCase.execute(
        data.name,
        data?.description,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all benefitActions
  @Get('benefit-actions')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefitActions(): Promise<BenefitAction[]> {
    try {
      return await this.findMethodsBenefitActionUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create client
  @Post('client')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createClient(
    @Body() data: ClientCreateDto,
  ): Promise<ClientFullResponseDto> {
    try {
      await this.loyaltyValidateRules.createClientValidate(
        data.phone,
        data.tagIds || [],
        data?.devNumber,
        data?.number,
      );
      return await this.createClientUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update client
  @Patch('client')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async updateClient(
    @Body() data: ClientUpdateDto,
  ): Promise<ClientFullResponseDto> {
    try {
      const client = await this.loyaltyValidateRules.updateClientValidate(
        data.clientId,
        data?.tagIds || [],
      );
      return await this.updateClientUseCase.execute(data, client);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get clients by filter
  @Get('clients')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getClient(
    @Query() data: ClientFilterDto,
  ): Promise<ClientResponseDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.findByFilterClientUseCase.execute({
        ...data,
        skip,
        take,
      });
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get client by id
  @Get('client/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientFullResponseDto> {
    try {
      const client = await this.loyaltyValidateRules.getClientByIdValidate(id);
      const tags = await this.findMethodsTagUseCase.getAllByClientId(client.id);
      const card = await this.findMethodsCardUseCase.getByClientId(client.id);
      return {
        id: client.id,
        name: client.name,
        birthday: client.birthday,
        phone: client.phone,
        email: client?.email,
        gender: client?.gender,
        status: client.status,
        contractType: client.contractType,
        comment: client?.comment,
        refreshTokenId: client?.refreshTokenId,
        placementId: client?.placementId,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        tags: tags.map((tag) => tag.getProps()),
        card: card ? {
          id: card.id,
          balance: card.balance,
          mobileUserId: card.mobileUserId,
          devNumber: card.devNumber,
          number: card.number,
          monthlyLimit: card?.monthlyLimit,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        } : null,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get benefits card
  @Get('card/benefits/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async benefitCard(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardBenefitDataDto> {
    try {
      const card = await this.loyaltyValidateRules.cardBenefitValidate(id);
      return await this.getBenefitsCardUseCase.execute(card);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create tag
  @Post('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createTag(@Body() data: TagCreateDto): Promise<any> {
    try {
      await this.loyaltyValidateRules.createTagValidate(data.name);
      return await this.createTagUseCase.execute(data.name, data.color);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all tags
  @Get('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getAllTags(): Promise<any> {
    try {
      return await this.findMethodsTagUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Delete tags
  @Delete('tag/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(200)
  async deleteTags(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const tag = await this.loyaltyValidateRules.deleteTagValidate(id);
      return await this.deleteTagUseCase.execute(tag);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Get all cards
  @Get('cards')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getAllCard(@Query() data: CardsFilterDto): Promise<Card[]> {
    try {
      return await this.findMethodsCardUseCase.getAll(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('user-key-stats')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getUserKeyStats(@Query() data: ClientKeyStatsDto): Promise<UserKeyStatsResponseDto> {
    try {
      return await this.findMethodsCardUseCase.getUserKeyStatsByOrganization(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
