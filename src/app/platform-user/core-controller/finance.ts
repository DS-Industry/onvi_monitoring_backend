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
import { ShiftReportCreateDto } from '@platform-user/core-controller/dto/receive/shift-report-create.dto';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { CreateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-create';
import { ShiftReportAddWorkerDto } from '@platform-user/core-controller/dto/receive/shift-report-add-worker.dto';
import { AddWorkerShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-add-worker';
import { ShiftReportResponseDto } from '@platform-user/core-controller/dto/response/shift-report-response.dto';
import { ShiftReportsResponseDto } from '@platform-user/core-controller/dto/response/shift-reports-response.dto';
import { GetAllByFilterShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-all-by-filter';
import { DayShiftReportGetByFilterDto } from '@platform-user/core-controller/dto/receive/day-shift-report-get-by-filter.dto';
import { DayShiftReportGetByFilterResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-get-by-filter-response.dto';
import { GetByFilterWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-get-by-filter';
import { GetOneFullShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-one-full';
import { UpdateWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-update';
import { DayShiftReportUpdateDto } from '@platform-user/core-controller/dto/receive/day-shift-report-update.dto';
import { SendWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-send';
import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';
import { CreateWorkDayShiftReportCashOperUseCase } from '@finance/shiftReport/workDayShiftReportCashOper/use-cases/workDayShiftReportCashOper-create';
import { DayShiftReportCashOperCreateDto } from '@platform-user/core-controller/dto/receive/day-shift-report-cash-oper-create.dto';
import { DayShiftReportOperDataResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-oper-data-response.dto';
import { GetOperDataWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-get-oper-data';
import { FindMethodsWorkDayShiftReportCashOperUseCase } from '@finance/shiftReport/workDayShiftReportCashOper/use-cases/workDayShiftReportCashOper-find-methods';
import { CleanDataResponseDto } from '@platform-user/core-controller/dto/response/clean-data-response.dto';
import { CleanDataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-clean-data';
import {
  SuspiciouslyDataDeviceProgramUseCase
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-suspiciously-data";
import {
  SuspiciouslyDataResponseDto
} from "@platform-user/core-controller/dto/response/suspiciously-data-response.dto";

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
    private readonly createShiftReportUseCase: CreateShiftReportUseCase,
    private readonly addWorkerShiftReportUseCase: AddWorkerShiftReportUseCase,
    private readonly getOneFullShiftReportUseCase: GetOneFullShiftReportUseCase,
    private readonly getAllByFilterShiftReportUseCase: GetAllByFilterShiftReportUseCase,
    private readonly getByFilterWorkDayShiftReportUseCase: GetByFilterWorkDayShiftReportUseCase,
    private readonly updateWorkDayShiftReportUseCase: UpdateWorkDayShiftReportUseCase,
    private readonly sendWorkDayShiftReportUseCase: SendWorkDayShiftReportUseCase,
    private readonly createWorkDayShiftReportCashOperUseCase: CreateWorkDayShiftReportCashOperUseCase,
    private readonly getOperDataWorkDayShiftReportUseCase: GetOperDataWorkDayShiftReportUseCase,
    private readonly findMethodsWorkDayShiftReportCashOperUseCase: FindMethodsWorkDayShiftReportCashOperUseCase,
    private readonly cleanDataDeviceProgramUseCase: CleanDataDeviceProgramUseCase,
    private readonly suspiciouslyDataDeviceProgramUseCase: SuspiciouslyDataDeviceProgramUseCase,
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
  //Create TimeStamp by deviceId
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
  //Create ShiftReport
  @Post('shift-report')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateShiftReportAbility())
  @HttpCode(201)
  async createShiftReport(
    @Request() req: any,
    @Body() data: ShiftReportCreateDto,
  ): Promise<ShiftReport> {
    try {
      const { ability, user } = req;
      await this.posValidateRules.getOneByIdValidate(data.posId, ability);
      return await this.createShiftReportUseCase.execute(data, user);
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
  //Add worker ShiftReport
  @Post('shift-report/worker/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async addWorker(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
    @Body() data: ShiftReportAddWorkerDto,
  ): Promise<ShiftReportResponseDto> {
    try {
      const { ability } = req;
      await this.financeValidateRules.addWorkerShiftReport(
        shiftReportId,
        data.userId,
        ability,
      );
      return await this.addWorkerShiftReportUseCase.execute(
        shiftReportId,
        data.userId,
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
  //Get Shift Reports
  @Get('shift-reports/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadCashCollectionAbility())
  @HttpCode(200)
  async getShiftReports(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
    @Query() data: DataFilterDto,
  ): Promise<ShiftReportsResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getAllByFilterShiftReportUseCase.execute(
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
  //Get one ShiftReport
  @Get('shift-report/:shiftReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async getOneById(
    @Request() req: any,
    @Param('shiftReportId', ParseIntPipe) shiftReportId: number,
  ): Promise<ShiftReportResponseDto> {
    try {
      const { ability } = req;
      const shiftReport = await this.financeValidateRules.getOneByIdShiftReport(
        shiftReportId,
        ability,
      );
      return await this.getOneFullShiftReportUseCase.execute(shiftReport);
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
  //Get/Create DayShiftReport
  @Post('shift-report/day-report')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async getDayReportByFilter(
    @Request() req: any,
    @Body() data: DayShiftReportGetByFilterDto,
  ): Promise<DayShiftReportGetByFilterResponseDto> {
    try {
      const { ability, user } = req;
      await this.financeValidateRules.addWorkerShiftReport(
        data.shiftReportId,
        data.userId,
        ability,
      );
      return await this.getByFilterWorkDayShiftReportUseCase.execute(
        data,
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
  //Get DayShiftReport by id
  @Get('shift-report/day-report/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getDayReportById(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<DayShiftReportGetByFilterResponseDto> {
    try {
      const { ability } = req;
      const workDayShiftReport =
        await this.financeValidateRules.getDayReportById(dayReportId, ability);

      return {
        id: workDayShiftReport.id,
        workerId: workDayShiftReport.workerId,
        workDate: workDayShiftReport.workDate,
        typeWorkDay: workDayShiftReport.typeWorkDay,
        timeWorkedOut: workDayShiftReport?.timeWorkedOut,
        startWorkingTime: workDayShiftReport?.startWorkingTime,
        endWorkingTime: workDayShiftReport?.endWorkingTime,
        estimation: workDayShiftReport?.estimation,
        prize: workDayShiftReport?.prize,
        fine: workDayShiftReport?.fine,
        comment: workDayShiftReport?.comment,
      };
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
  //Update DayShiftReport by id
  @Patch('shift-report/day-report/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async updateDayReportById(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
    @Body() data: DayShiftReportUpdateDto,
  ): Promise<DayShiftReportGetByFilterResponseDto> {
    try {
      const { ability, user } = req;
      const workDayShiftReport =
        await this.financeValidateRules.updateDayReportById(
          dayReportId,
          ability,
        );
      const updateWorkDayShiftReport =
        await this.updateWorkDayShiftReportUseCase.execute(
          data,
          workDayShiftReport,
          user,
        );

      return {
        id: updateWorkDayShiftReport.id,
        workerId: updateWorkDayShiftReport.workerId,
        workDate: updateWorkDayShiftReport.workDate,
        typeWorkDay: updateWorkDayShiftReport.typeWorkDay,
        timeWorkedOut: updateWorkDayShiftReport?.timeWorkedOut,
        startWorkingTime: updateWorkDayShiftReport?.startWorkingTime,
        endWorkingTime: updateWorkDayShiftReport?.endWorkingTime,
        estimation: updateWorkDayShiftReport?.estimation,
        status: updateWorkDayShiftReport?.status,
        cashAtStart: updateWorkDayShiftReport?.cashAtStart,
        cashAtEnd: updateWorkDayShiftReport?.cashAtEnd,
        prize: updateWorkDayShiftReport?.prize,
        fine: updateWorkDayShiftReport?.fine,
        comment: updateWorkDayShiftReport?.comment,
      };
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
  //Send DayShiftReport by id
  @Post('shift-report/day-report/send/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async sendDayReportById(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<DayShiftReportGetByFilterResponseDto> {
    try {
      const { ability, user } = req;
      const workDayShiftReport =
        await this.financeValidateRules.sendDayReportById(dayReportId, ability);
      const updateWorkDayShiftReport =
        await this.sendWorkDayShiftReportUseCase.execute(
          workDayShiftReport,
          user,
        );

      return {
        id: updateWorkDayShiftReport.id,
        workerId: updateWorkDayShiftReport.workerId,
        workDate: updateWorkDayShiftReport.workDate,
        typeWorkDay: updateWorkDayShiftReport.typeWorkDay,
        timeWorkedOut: updateWorkDayShiftReport?.timeWorkedOut,
        startWorkingTime: updateWorkDayShiftReport?.startWorkingTime,
        endWorkingTime: updateWorkDayShiftReport?.endWorkingTime,
        estimation: updateWorkDayShiftReport?.estimation,
        status: updateWorkDayShiftReport?.status,
        cashAtStart: updateWorkDayShiftReport?.cashAtStart,
        cashAtEnd: updateWorkDayShiftReport?.cashAtEnd,
        prize: updateWorkDayShiftReport?.prize,
        fine: updateWorkDayShiftReport?.fine,
        comment: updateWorkDayShiftReport?.comment,
      };
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
  //Create cash oper
  @Post('shift-report/day-report/oper/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateShiftReportAbility())
  @HttpCode(201)
  async createCashOper(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
    @Body() data: DayShiftReportCashOperCreateDto,
  ): Promise<WorkDayShiftReportCashOper> {
    try {
      const { ability, user } = req;
      const workDayShiftReport = await this.financeValidateRules.createCashOper(
        dayReportId,
        ability,
      );
      return await this.createWorkDayShiftReportCashOperUseCase.execute(
        data,
        workDayShiftReport,
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
  //Get DataCashOper
  @Get('shift-report/day-report/oper/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getCashOper(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<DayShiftReportOperDataResponseDto> {
    try {
      const { ability } = req;
      const workDayShiftReport =
        await this.financeValidateRules.getDayReportById(dayReportId, ability);
      return await this.getOperDataWorkDayShiftReportUseCase.execute(
        workDayShiftReport,
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
  //Get DataCashOper refund
  @Get('shift-report/day-report/refund/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getCashOperRefund(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<WorkDayShiftReportCashOper[]> {
    try {
      const { ability } = req;
      const workDayShiftReport =
        await this.financeValidateRules.getDayReportById(dayReportId, ability);
      return await this.findMethodsWorkDayShiftReportCashOperUseCase.getAllByWorkDayIdAndType(
        workDayShiftReport.id,
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
  //Get DayReport Cleans
  @Get('shift-report/day-report/clean/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getClean(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<CleanDataResponseDto[]> {
    try {
      const { ability } = req;
      const cleanData = await this.financeValidateRules.getClean(
        dayReportId,
        ability,
      );
      return await this.cleanDataDeviceProgramUseCase.execute(
        cleanData.posId,
        cleanData.workDay.startWorkingTime,
        cleanData.workDay.endWorkingTime,
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
  //Get DayReport suspiciouslys
  @Get('shift-report/day-report/suspiciously/:dayReportId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadShiftReportAbility())
  @HttpCode(201)
  async getSuspiciously(
    @Request() req: any,
    @Param('dayReportId', ParseIntPipe) dayReportId: number,
  ): Promise<SuspiciouslyDataResponseDto[]> {
    try {
      const { ability } = req;
      const cleanData = await this.financeValidateRules.getClean(
        dayReportId,
        ability,
      );
      return await this.suspiciouslyDataDeviceProgramUseCase.execute(
        cleanData.posId,
        cleanData.workDay.startWorkingTime,
        cleanData.workDay.endWorkingTime,
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
}
