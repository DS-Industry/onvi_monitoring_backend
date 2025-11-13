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
import {
  DeviceException,
  FinanceException,
  HrException,
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
  CreateShiftReportAbility,
  ReadCashCollectionAbility,
  ReadShiftReportAbility,
  UpdateCashCollectionAbility,
  UpdateShiftReportAbility,
} from '@common/decorators/abilities.decorator';
import { FinanceValidateRules } from '@platform-user/validate/validate-rules/finance-rules';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import { CashCollectionRecalculateDto } from '@platform-user/core-controller/dto/receive/cash-collection-recalculate.dto';
import { RecalculateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-recalculate';
import {
  StatusCashCollection,
  TypeWorkDayShiftReportCashOper,
} from '@prisma/client';
import { UpdateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-update';
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
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { ShiftReportGetByFilterDto } from '@platform-user/core-controller/dto/receive/shift-report-get-by-filter.dto';
import { ShiftReportUpdateDto } from '@platform-user/core-controller/dto/receive/shift-report-update.dto';
import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';
import { DayShiftReportCashOperCreateDto } from '@platform-user/core-controller/dto/receive/day-shift-report-cash-oper-create.dto';
import { DayShiftReportOperDataResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-oper-data-response.dto';
import { CleanDataResponseDto } from '@platform-user/core-controller/dto/response/clean-data-response.dto';
import { CleanDataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-clean-data';
import { SuspiciouslyDataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-suspiciously-data';
import { SuspiciouslyDataResponseDto } from '@platform-user/core-controller/dto/response/suspiciously-data-response.dto';
import { DataFullFilterDto } from '@platform-user/core-controller/dto/receive/data-full-filter.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { DeleteCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-delete';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { ShiftReportFilterDto } from '@platform-user/core-controller/dto/receive/shiftReport-filter.dto';
import { ShiftReportReceiverResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/day-shift-report-get-by-filter-response.dto';
import { ReceiverShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-receiver';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';
import { SendShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-send';
import { CreateShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-create';
import { GetOperDataShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-oper-data';
import { FindMethodsShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-find-methods';
import { DeleteShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-delete';
import { Worker } from '@hr/worker/domain/worker';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { ConnectionPosWorkerUseCase } from '@pos/pos/use-cases/pos-worker-connection';
import { ConnectedWorkerPosDto } from '@platform-user/core-controller/dto/receive/ConnectedWorkerPosDto';
import { CarStatisticPosUseCase } from '@pos/pos/use-cases/pos-car-statistic';
import { FullDataShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-full-data';

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
    private readonly cleanDataDeviceProgramUseCase: CleanDataDeviceProgramUseCase,
    private readonly suspiciouslyDataDeviceProgramUseCase: SuspiciouslyDataDeviceProgramUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly deleteCashCollectionUseCase: DeleteCashCollectionUseCase,
    private readonly posValidateRules: PosValidateRules,
    private readonly deviceValidateRules: DeviceValidateRules,
    private readonly eventEmitter: EventEmitter2,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly receiverShiftReportUseCase: ReceiverShiftReportUseCase,
    private readonly updateShiftReportUseCase: UpdateShiftReportUseCase,
    private readonly sendShiftReportUseCase: SendShiftReportUseCase,
    private readonly createShiftReportCashOperUseCase: CreateShiftReportCashOperUseCase,
    private readonly getOperDataShiftReportUseCase: GetOperDataShiftReportUseCase,
    private readonly findMethodsShiftReportCashOperUseCase: FindMethodsShiftReportCashOperUseCase,
    private readonly deleteShiftReportUseCase: DeleteShiftReportUseCase,
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly connectionPosWorkerUseCase: ConnectionPosWorkerUseCase,
    private readonly carStatisticPosUseCase: CarStatisticPosUseCase,
    private readonly fullDataShiftReportUseCase: FullDataShiftReportUseCase,
  ) {}
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
      const newCashCollection = await this.updateCashCollectionUseCase.execute(
        {
          status: StatusCashCollection.SAVED,
          sendDate: undefined,
        },
        cashCollection,
        user,
      );

      this.eventEmitter.emit('manager-paper.delete-cash-collection', {
        cashCollectionId: newCashCollection.id,
      });

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
  @Delete('cash-collection/:cashCollectionId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateCashCollectionAbility())
  @HttpCode(201)
  async deleteCashCollection(
    @Request() req: any,
    @Param('cashCollectionId', ParseIntPipe) cashCollectionId: number,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      const cashCollection =
        await this.financeValidateRules.deleteCashCollectionValidate(
          cashCollectionId,
          ability,
        );
      await this.deleteCashCollectionUseCase.execute(cashCollection);
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
  @Get('cash-collections')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadCashCollectionAbility())
  @HttpCode(200)
  async getCashCollections(
    @Request() req: any,
    @Query() data: DataFullFilterDto,
  ): Promise<CashCollectionsResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      let posIds: number[] = [];
      if (data.posId != undefined) {
        const pos = await this.posValidateRules.getOneByIdValidate(
          data.posId,
          ability,
        );
        posIds.push(pos.id);
      } else {
        const poses = await this.findMethodsPosUseCase.getAllByFilter({
          ability: ability,
          placementId: data?.placementId,
        });
        posIds = poses.map((pos) => pos.id);
      }
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getAllByFilterCashCollectionUseCase.execute(
        posIds,
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
  @Get('time-stamp/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadCashCollectionAbility())
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
  @Get('shift-reports')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(200)
  async getShiftReports(
    @Request() req: any,
    @Query() data: ShiftReportFilterDto,
  ): Promise<ShiftReport[]> {
    try {
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(
        data.posId,
        ability,
      );
      return await this.findMethodsShiftReportUseCase.getAllByFilter(
        data.dateStart,
        data.dateEnd,
        pos.id,
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
  @Post('shift/create')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(201)
  async createShiftReport(
    @Request() req: any,
    @Body() data: ShiftReportGetByFilterDto,
  ): Promise<ShiftReportReceiverResponseDto> {
    try {
      const { ability, user } = req;
      await this.financeValidateRules.receiverShiftReport(
        data.posId,
        data.workerId,
        ability,
      );
      const shiftReport = await this.receiverShiftReportUseCase.execute(
        data.posId,
        data.workerId,
        data.workDate,
        user,
        data.typeWorkDay,
        data?.startWorkingTime,
        data?.endWorkingTime,
      );
      const worker = await this.findMethodsWorkerUseCase.getById(
        shiftReport.workerId,
      );

      shiftReport.totalCar = await this.carStatisticPosUseCase.execute(
        shiftReport.posId,
        shiftReport.startWorkingTime,
        shiftReport.endWorkingTime,
      );
      shiftReport.workerName = worker.name;
      shiftReport.dailySalary = worker.dailySalary;
      shiftReport.bonusPayout = worker.bonusPayout;

      return shiftReport;
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
  @Get('shift-report/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getShiftReportById(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<ShiftReportReceiverResponseDto> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      const shiftReportFull =
        await this.fullDataShiftReportUseCase.execute(shiftReport);
      const worker = await this.findMethodsWorkerUseCase.getById(
        shiftReport.workerId,
      );

      shiftReportFull.totalCar = await this.carStatisticPosUseCase.execute(
        shiftReport.posId,
        shiftReport.startWorkingTime,
        shiftReport.endWorkingTime,
      );
      shiftReportFull.workerName = worker.name;
      shiftReportFull.dailySalary = worker.dailySalary;
      shiftReportFull.bonusPayout = worker.bonusPayout;

      return shiftReportFull;
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
  @Patch('shift-report/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(201)
  async updateShiftReportById(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
    @Body() data: ShiftReportUpdateDto,
  ): Promise<ShiftReportReceiverResponseDto> {
    try {
      const { ability, user } = req;
      const workDayShiftReport =
        await this.financeValidateRules.updateShiftReportById(
          shiftReportId,
          ability,
        );
      const updateShiftReport = await this.updateShiftReportUseCase.execute(
        data,
        workDayShiftReport,
        user,
      );

      const shiftReportFull =
        await this.fullDataShiftReportUseCase.execute(updateShiftReport);
      const worker = await this.findMethodsWorkerUseCase.getById(
        updateShiftReport.workerId,
      );

      shiftReportFull.totalCar = await this.carStatisticPosUseCase.execute(
        updateShiftReport.posId,
        updateShiftReport.startWorkingTime,
        updateShiftReport.endWorkingTime,
      );
      shiftReportFull.workerName = worker.name;

      return shiftReportFull;
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
  @Post('shift-report/send/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(201)
  async sendShiftReport(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<ShiftReportReceiverResponseDto> {
    try {
      const { ability, user } = req;
      const shiftReport = await this.financeValidateRules.updateShiftReportById(
        shiftReportId,
        ability,
      );
      const updateShiftReport = await this.sendShiftReportUseCase.execute(
        shiftReport,
        user,
      );

      const shiftReportFull =
        await this.fullDataShiftReportUseCase.execute(updateShiftReport);
      const worker = await this.findMethodsWorkerUseCase.getById(
        updateShiftReport.workerId,
      );

      shiftReportFull.totalCar = await this.carStatisticPosUseCase.execute(
        updateShiftReport.posId,
        updateShiftReport.startWorkingTime,
        updateShiftReport.endWorkingTime,
      );
      shiftReportFull.workerName = worker.name;

      return shiftReportFull;
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
  @Patch('shift-report/return/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async returnShiftReportById(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<{ status: string }> {
    try {
      const { ability, user } = req;
      const workDayShiftReport =
        await this.financeValidateRules.returnDayReportById(
          shiftReportId,
          ability,
        );
      await this.updateShiftReportUseCase.execute(
        {
          status: StatusCashCollection.SAVED,
        },
        workDayShiftReport,
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
  @Get('shift-report/worker-by-pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getWorkerByPosId(
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<Worker[]> {
    try {
      return await this.findMethodsWorkerUseCase.getAllByPosId(posId);
    } catch (e) {
      if (e instanceof HrException) {
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
  @Patch('shift-report/worker-pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async updateConnectedWorkerPos(
    @Param('posId', ParseIntPipe) posId: number,
    @Body() body: ConnectedWorkerPosDto,
  ): Promise<{ status: string }> {
    try {
      await this.posValidateRules.updateConnectedWorkerPos(
        body.workerIds,
        posId,
      );
      return await this.connectionPosWorkerUseCase.execute(
        body.workerIds,
        posId,
      );
    } catch (e) {
      if (e instanceof HrException) {
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
  @Post('shift-report/oper/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(201)
  async createCashOper(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
    @Body() data: DayShiftReportCashOperCreateDto,
  ): Promise<ShiftReportCashOper> {
    try {
      const { ability, user } = req;
      const shiftReport = await this.financeValidateRules.updateShiftReportById(
        shiftReportId,
        ability,
      );
      return await this.createShiftReportCashOperUseCase.execute(
        data,
        shiftReport,
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
  @Get('shift-report/oper/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getCashOper(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<DayShiftReportOperDataResponseDto> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      return await this.getOperDataShiftReportUseCase.execute(shiftReport);
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
  @Get('shift-report/refund/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getCashOperRefund(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<ShiftReportCashOper[]> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      return await this.findMethodsShiftReportCashOperUseCase.getAllByWorkDayIdAndType(
        shiftReport.id,
        TypeWorkDayShiftReportCashOper.REFUND,
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
  @Get('shift-report/clean/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getClean(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<CleanDataResponseDto[]> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      return await this.cleanDataDeviceProgramUseCase.execute(
        shiftReport.posId,
        shiftReport.startWorkingTime,
        shiftReport.endWorkingTime,
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
  @Get('shift-report/suspiciously/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getSuspiciously(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<SuspiciouslyDataResponseDto[]> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      return await this.suspiciouslyDataDeviceProgramUseCase.execute(
        shiftReport.posId,
        shiftReport.startWorkingTime,
        shiftReport.endWorkingTime,
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

  @Delete('shift-report/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(204)
  async deleteShiftReport(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<void> {
    try {
      const { ability } = req;
      const shiftReport =
        await this.financeValidateRules.deleteShiftReportValidate(
          shiftReportId,
          ability,
        );
      await this.deleteShiftReportUseCase.execute(shiftReport);
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
}
