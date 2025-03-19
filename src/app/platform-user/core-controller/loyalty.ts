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
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateLoyaltyAbility,
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

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly findByFilterClientUseCase: FindByFilterClientUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
    private readonly loyaltyValidateRules: LoyaltyValidateRules,
  ) {}
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
        data.tagIds,
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
        data?.tagIds,
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
  @CheckAbilities(new CreateLoyaltyAbility())
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
  @CheckAbilities(new CreateLoyaltyAbility())
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
        type: client.type,
        inn: client?.inn,
        comment: client?.comment,
        refreshTokenId: client?.refreshTokenId,
        placementId: client?.placementId,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        tags: tags.map((tag) => tag.getProps()),
        card: {
          id: card.id,
          balance: card.balance,
          mobileUserId: card.mobileUserId,
          devNumber: card.devNumber,
          number: card.number,
          monthlyLimit: card?.monthlyLimit,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        },
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
  @CheckAbilities(new CreateLoyaltyAbility())
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
}
