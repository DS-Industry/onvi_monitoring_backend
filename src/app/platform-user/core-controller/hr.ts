import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePositionUseCase } from '@hr/position/use-case/position-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateHrAbility,
  ReadHrAbility,
  UpdateHrAbility,
} from '@common/decorators/abilities.decorator';
import { PositionCreateDto } from '@platform-user/core-controller/dto/receive/position-create.dto';
import { Position } from '@hr/position/domain/position';
import { HrException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { UpdatePositionUseCase } from '@hr/position/use-case/position-update';
import { PositionUpdateDto } from '@platform-user/core-controller/dto/receive/position-update.dto';
import { HrValidateRules } from '@platform-user/validate/validate-rules/hr-validate-rules';
import { FindMethodsPositionUseCase } from '@hr/position/use-case/position-find-methods';
import { CreateWorkerUseCase } from '@hr/worker/use-case/worker-create';
import { Worker } from '@hr/worker/domain/worker';
import { WorkerCreateDto } from '@platform-user/core-controller/dto/receive/worker-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { WorkerFilterDto } from '@platform-user/core-controller/dto/receive/worker-filter.dto';
import { UpdateWorkerUseCase } from '@hr/worker/use-case/worker-update';
import { WorkerUpdateDto } from '@platform-user/core-controller/dto/receive/worker-update.dto';
import { PrepaymentCreateDto } from '@platform-user/core-controller/dto/receive/prepayment-create.dto';
import { CreatePaymentUseCase } from '@hr/payment/use-case/payment-create';
import { PaymentType } from '@prisma/client';
import { PaymentReportFilterDto } from '@platform-user/core-controller/dto/receive/payment-report-filter.dto';
import { PaymentCalculateDto } from '@platform-user/core-controller/dto/receive/payment-calculate.dto';
import { PrepaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/prepayment-calculate-response.dro';
import { PaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/payment-calculate-response.dro';
import { CalculatePaymentUseCase } from '@hr/payment/use-case/payment-calculate';
import { PaymentCreateDto } from '@platform-user/core-controller/dto/receive/payment-create.dto';
import { PaymentsGetResponseDto } from '@platform-user/core-controller/dto/response/payments-get-response.dto';
import { GetReportPaymentUseCase } from '@hr/payment/use-case/payment-get-report';
import { PrepaymentsGetResponseDto } from '@platform-user/core-controller/dto/response/prepayments-get-response.dto';
import { PaymentCalculateWorkersDto } from '@platform-user/core-controller/dto/receive/payment-calculate-workers.dto';

@Controller('hr')
export class HrController {
  constructor(
    private readonly createPositionUseCase: CreatePositionUseCase,
    private readonly updatePositionUseCase: UpdatePositionUseCase,
    private readonly hrValidateRules: HrValidateRules,
    private readonly findMethodsPositionUseCase: FindMethodsPositionUseCase,
    private readonly createWorkerUseCase: CreateWorkerUseCase,
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly updateWorkerUseCase: UpdateWorkerUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly calculatePaymentUseCase: CalculatePaymentUseCase,
    private readonly getReportPaymentUseCase: GetReportPaymentUseCase,
  ) {}

  @Post('worker')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createWorker(
    @Request() req: any,
    @Body() data: WorkerCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Worker> {
    try {
      const { ability } = req;
      await this.hrValidateRules.createWorkerValidate(
        data.hrPositionId,
        data.organizationId,
        ability,
      );
      if (file) {
        return await this.createWorkerUseCase.execute(data, file);
      } else {
        return await this.createWorkerUseCase.execute(data);
      }
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

  @Patch('worker')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateHrAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async updateWorker(
    @Request() req: any,
    @Body() data: WorkerUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Worker> {
    try {
      const { ability } = req;
      const worker = await this.hrValidateRules.updateWorkerValidate(
        data.workerId,
        ability,
        data?.hrPositionId,
      );
      if (file) {
        return await this.updateWorkerUseCase.execute(data, worker, file);
      } else {
        return await this.updateWorkerUseCase.execute(data, worker);
      }
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

  @Get('workers')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getWorkers(
    @Request() req: any,
    @Query() data: WorkerFilterDto,
  ): Promise<Position[]> {
    try {
      let skip = undefined;
      let take = undefined;
      let placementId = undefined;
      let hrPositionId = undefined;
      let organizationId = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      if (data.placementId != '*') {
        placementId = data.placementId;
      }
      if (data.hrPositionId != '*') {
        hrPositionId = data.hrPositionId;
      }
      if (data.organizationId != '*') {
        organizationId = data.organizationId;
      }
      return await this.findMethodsWorkerUseCase.getAllByFilter(
        placementId,
        hrPositionId,
        organizationId,
        data?.name,
        skip,
        take,
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

  @Get('worker/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getWorker(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Position> {
    try {
      return await this.hrValidateRules.findOneByIdWorkerValidate(id);
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

  @Post('position')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async createPosition(
    @Request() req: any,
    @Body() data: PositionCreateDto,
  ): Promise<Position> {
    try {
      const { ability } = req;
      await this.hrValidateRules.createPositionValidate(
        data.organizationId,
        ability,
      );
      return await this.createPositionUseCase.execute(
        data.name,
        data.organizationId,
        data?.description,
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

  @Patch('position')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateHrAbility())
  @HttpCode(201)
  async updatePosition(
    @Request() req: any,
    @Body() data: PositionUpdateDto,
  ): Promise<Position> {
    try {
      const position = await this.hrValidateRules.findOneByIdPositionValidate(
        data.positionId,
      );
      return await this.updatePositionUseCase.execute(
        position,
        data?.description,
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

  @Get('position/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getPosition(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Position> {
    try {
      return await this.hrValidateRules.findOneByIdPositionValidate(id);
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

  @Get('positions')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getPositions(@Request() req: any): Promise<Position[]> {
    try {
      const { ability } = req;
      return await this.findMethodsPositionUseCase.getAllByAbility(ability);
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

  @Get('positions-org/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getPositionsByOrgId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Position[]> {
    try {
      return await this.findMethodsPositionUseCase.getAllByOrgId(id);
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

  @Post('prepayment/calculate')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async calculatePrepayment(
    @Request() req: any,
    @Body() data: PaymentCalculateDto,
  ): Promise<PrepaymentCalculateResponseDro[]> {
    try {
      return await this.calculatePaymentUseCase.prepayment(data);
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

  @Post('prepayment/calculate/workers')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async calculatePrepaymentWorkers(
    @Request() req: any,
    @Body() data: PaymentCalculateWorkersDto,
  ): Promise<PrepaymentCalculateResponseDro[]> {
    try {
      return await this.calculatePaymentUseCase.prepaymentWorker(data);
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

  @Post('payment/calculate')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async calculatePayment(
    @Request() req: any,
    @Body() data: PaymentCalculateDto,
  ): Promise<PaymentCalculateResponseDro[]> {
    try {
      return await this.calculatePaymentUseCase.payment(data);
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

  @Post('payment/calculate/workers')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async calculatePaymentWorkers(
    @Request() req: any,
    @Body() data: PaymentCalculateWorkersDto,
  ): Promise<PaymentCalculateResponseDro[]> {
    try {
      return await this.calculatePaymentUseCase.paymentWorker(data);
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

  @Post('prepayment')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async createPrepayment(
    @Request() req: any,
    @Body() data: PrepaymentCreateDto,
  ): Promise<any> {
    try {
      const { user } = req;
      /*await this.hrValidateRules.createPrepayment(
        data.hrWorkerId,
        data.billingMonth,
      );*/
      await this.createPaymentUseCase.createMany(
        data.payments.map((payment) => ({
          ...payment,
          paymentType: PaymentType.PREPAYMENT,
          prize: 0,
          fine: 0,
        })),
        user,
      );
      return { status: 'SUCCESS' };
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

  @Post('payment')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateHrAbility())
  @HttpCode(201)
  async createPayment(
    @Request() req: any,
    @Body() data: PaymentCreateDto,
  ): Promise<any> {
    try {
      const { user } = req;
      /*await this.hrValidateRules.createPrepayment(
        data.hrWorkerId,
        data.billingMonth,
      );*/
      await this.createPaymentUseCase.createMany(
        data.payments.map((payment) => ({
          ...payment,
          paymentType: PaymentType.PAYMENT,
        })),
        user,
      );
      return { status: 'SUCCESS' };
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

  @Get('prepayments')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getPrepayments(
    @Request() req: any,
    @Query() data: PaymentReportFilterDto,
  ): Promise<PrepaymentsGetResponseDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getReportPaymentUseCase.prepayment({
        ...data,
        skip,
        take,
      });
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

  @Get('payments')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadHrAbility())
  @HttpCode(201)
  async getPayments(
    @Request() req: any,
    @Query() data: PaymentReportFilterDto,
  ): Promise<PaymentsGetResponseDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getReportPaymentUseCase.payment({
        ...data,
        skip,
        take,
      });
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
}
