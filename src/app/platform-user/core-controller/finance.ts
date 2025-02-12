import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import {
  DeviceException,
  FinanceException,
  PosException,
} from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { CashCollectionCreateDto } from '@platform-user/core-controller/dto/receive/cash-collection-create.dto';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { CreateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-create';
import {
  CheckAbilities,
  CreateCashCollectionAbility,
  ReadCashCollectionAbility,
  UpdateCashCollectionAbility,
} from '@common/decorators/abilities.decorator';
import { FinanceValidateRules } from '@platform-user/validate/validate-rules/finance-rules';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import { CashCollectionRecalculateDto } from '@platform-user/core-controller/dto/receive/cash-collection-recalculate.dto';
import { RecalculateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-recalculate';
import { StatusCashCollection } from '@prisma/client';
import { UpdateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-update';
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { CashCollectionsResponseDto } from '@platform-user/core-controller/dto/response/cash-collections-response.dto';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { GetAllByFilterCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-get-all-by-filter';
import { GetOneFullDataCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-get-one-full-data';
import { FinanceGetTimeStampResponseDto } from '@platform-user/core-controller/dto/response/finance-get-time-stamp-response.dto';
import { GetAllTimeStampDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-get-all-time-stamp';
import { FinanceCreateTimeStampDto } from '@platform-user/core-controller/dto/receive/finance-create-time-stamp.dto';
import { CreateDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-create';
import { DeviceValidateRules } from '@platform-user/validate/validate-rules/device-validate-rules';
import { EVENT_TYPE_CASH_COLLECTION_ID } from '@constant/constants';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly createCashCollectionUseCase: CreateCashCollectionUseCase,
    private readonly financeValidateRules: FinanceValidateRules,
    private readonly recalculateCashCollectionUseCase: RecalculateCashCollectionUseCase,
    private readonly updateCashCollectionUseCase: UpdateCashCollectionUseCase,
    private readonly getAllByFilterCashCollectionUseCase: GetAllByFilterCashCollectionUseCase,
    private readonly getOneFullDataCashCollectionUseCase: GetOneFullDataCashCollectionUseCase,
    private readonly getAllTimeStampDeviceEventUseCase: GetAllTimeStampDeviceEventUseCase,
    private readonly createDeviceEventUseCase: CreateDeviceEventUseCase,
    private readonly posValidateRules: PosValidateRules,
    private readonly deviceValidateRules: DeviceValidateRules,
  ) {}
  //CreateCashCollection
  @Post('cash-collection')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(201)
  async createCashCollection(
    @Body() data: CashCollectionCreateDto,
    @Request() req: any,
  ): Promise<CashCollectionResponseDto> {
    try {
      const { user, ability } = req;
      const oldCashCollection =
        await this.financeValidateRules.createCashCollectionValidate(
          data.posId,
          data.cashCollectionDate,
          ability,
        );
      const carWashDevice =
        await this.findMethodsCarWashDeviceUseCase.getAllByPos(data.posId);
      return await this.createCashCollectionUseCase.execute(
        data,
        carWashDevice,
        user,
        oldCashCollection,
      );
    } catch (e) {
      if (e instanceof FinanceException) {
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

  //RecalculateCashCollection
  @Post('cash-collection/recalculate/:cashCollectionId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(201)
  async recalculateCashCollection(
    @Body() data: CashCollectionRecalculateDto,
    @Request() req: any,
    @Param('cashCollectionId', ParseIntPipe) cashCollectionId: number,
  ): Promise<CashCollectionResponseDto> {
    try {
      const { user, ability } = req;
      const cashCollectionDeviceIds = data.cashCollectionDeviceData.map(
        (item) => item.cashCollectionDeviceId,
      );
      const cashCollectionDeviceTypeIds = data.cashCollectionDeviceTypeData.map(
        (item) => item.cashCollectionDeviceTypeId,
      );

      const cashCollection =
        await this.financeValidateRules.recalculateCashCollectionValidate(
          cashCollectionId,
          cashCollectionDeviceIds,
          cashCollectionDeviceTypeIds,
          ability,
        );
      const carWashDevice =
        await this.findMethodsCarWashDeviceUseCase.getAllByPos(
          cashCollection.posId,
        );
      return await this.recalculateCashCollectionUseCase.execute(
        data,
        carWashDevice,
        cashCollection,
        StatusCashCollection.SAVED,
        user,
      );
    } catch (e) {
      if (e instanceof FinanceException) {
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

  //RecalculateAndSendCashCollection
  @Post('cash-collection/send/:cashCollectionId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(201)
  async recalculateAndSendCashCollection(
    @Body() data: CashCollectionRecalculateDto,
    @Request() req: any,
    @Param('cashCollectionId', ParseIntPipe) cashCollectionId: number,
  ): Promise<CashCollectionResponseDto> {
    try {
      const { user, ability } = req;
      const cashCollectionDeviceIds = data.cashCollectionDeviceData.map(
        (item) => item.cashCollectionDeviceId,
      );
      const cashCollectionDeviceTypeIds = data.cashCollectionDeviceTypeData.map(
        (item) => item.cashCollectionDeviceTypeId,
      );

      const cashCollection =
        await this.financeValidateRules.recalculateCashCollectionValidate(
          cashCollectionId,
          cashCollectionDeviceIds,
          cashCollectionDeviceTypeIds,
          ability,
        );
      const carWashDevice =
        await this.findMethodsCarWashDeviceUseCase.getAllByPos(
          cashCollection.posId,
        );
      return await this.recalculateCashCollectionUseCase.execute(
        data,
        carWashDevice,
        cashCollection,
        StatusCashCollection.SENT,
        user,
      );
    } catch (e) {
      if (e instanceof FinanceException) {
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

  //ReturnCashCollection
  @Patch('cash-collection/return/:cashCollectionId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateCashCollectionAbility())
  @HttpCode(201)
  async returnCashCollection(
    @Request() req: any,
    @Param('cashCollectionId', ParseIntPipe) cashCollectionId: number,
  ): Promise<{ status: string }> {
    try {
      const { user, ability } = req;
      const cashCollection =
        await this.financeValidateRules.returnCashCollectionValidate(
          cashCollectionId,
          ability,
        );
      await this.updateCashCollectionUseCase.execute(
        {
          status: StatusCashCollection.SAVED,
          sendDate: undefined,
        },
        cashCollection,
        user,
      );
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof FinanceException) {
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
  //GetCashCollection
  @Get('cash-collection/:cashCollectionId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadCashCollectionAbility())
  @HttpCode(200)
  async getCashCollection(
    @Request() req: any,
    @Param('cashCollectionId', ParseIntPipe) cashCollectionId: number,
  ): Promise<CashCollectionResponseDto> {
    try {
      const { ability } = req;
      const cashCollection =
        await this.financeValidateRules.getCashCollectionValidate(
          cashCollectionId,
          ability,
        );
      const carWashDevice =
        await this.findMethodsCarWashDeviceUseCase.getAllByPos(
          cashCollection.posId,
        );
      return await this.getOneFullDataCashCollectionUseCase.execute(
        cashCollection,
        carWashDevice,
      );
    } catch (e) {
      if (e instanceof FinanceException) {
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
  //GetCashCollections
  @Get('cash-collections/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadCashCollectionAbility())
  @HttpCode(200)
  async getCashCollections(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
    @Query() data: DataFilterDto,
  ): Promise<CashCollectionsResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getAllByFilterCashCollectionUseCase.execute(
        posId,
        data.dateStart,
        data.dateEnd,
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof FinanceException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else if (e instanceof PosException) {
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
  //Get TimeStamps by PosId
  @Get('time-stamp/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(200)
  async getTimeStamps(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<FinanceGetTimeStampResponseDto[]> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      return await this.getAllTimeStampDeviceEventUseCase.execute(posId);
    } catch (e) {
      if (e instanceof FinanceException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else if (e instanceof PosException) {
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
  //Post TimeStamp by deviceId
  @Post('time-stamp/:deviceId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(200)
  async createTimeStamp(
    @Request() req: any,
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Body() data: FinanceCreateTimeStampDto,
  ): Promise<{
    deviceId: number;
    tookMoneyTime: Date;
  }> {
    try {
      const { ability } = req;
      await this.deviceValidateRules.getByIdValidate(deviceId, ability);
      const deviceEvent = await this.createDeviceEventUseCase.execute(
        deviceId,
        EVENT_TYPE_CASH_COLLECTION_ID,
        data.dateTimeStamp,
      );
      return { deviceId: deviceEvent.id, tookMoneyTime: deviceEvent.eventDate };
    } catch (e) {
      if (e instanceof DeviceException) {
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
