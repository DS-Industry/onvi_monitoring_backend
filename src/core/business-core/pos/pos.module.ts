import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PosRepositoryProvider } from '@pos/pos/provider/pos';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { AddressModule } from '@address/address.module';
import { MonitoringPosUseCase } from '@pos/pos/use-cases/pos-monitoring';
import { MonitoringFullByIdPosUseCase } from '@pos/pos/use-cases/pos-monitoring-full-by-id';
import { ProgramPosUseCase } from '@pos/pos/use-cases/pos-program';
import { PosProgramFullUseCase } from '@pos/pos/use-cases/pos-program-full';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { CarWashPosProvider } from '@pos/carWashPos/provider/carWashPos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashDeviceTypeRepositoryProvider } from '@pos/device/deviceType/provider/deviceType';
import { CreateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-create';
import { UpdateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-update';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { CarWashDeviceRepositoryProvider } from '@pos/device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-create';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { CurrencyCarWashPosRepositoryProvider } from '@pos/device/device-data/currency/currency-car-wash-pos/provider/currency-car-wash-pos';
import { CurrencyRepositoryProvide } from '@pos/device/device-data/currency/currency/provider/currency';
import { CurrencyCreate } from '@pos/device/device-data/currency/currency/use-case/currency-create';
import { FindMethodsCurrencyUseCase } from '@pos/device/device-data/currency/currency/use-case/currency-find-methods';
import { DeviceEventTypeRepositoryProvider } from '@pos/device/device-data/device-data/device-event/device-event-type/provider/device-event-type';
import { DeviceEventHandlerUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-handler';
import { DeviceEventRepositoryProvider } from '@pos/device/device-data/device-data/device-event/device-event/provider/device-event';
import { DeviceMfuRepositoryProvider } from '@pos/device/device-data/device-data/device-mfu/provider/device-mfu';
import { DeviceMfuHandlerUseCase } from '@pos/device/device-data/device-data/device-mfu/use-case/device-mfu-handler';
import { DeviceOperationCardRepositoryProvider } from '@pos/device/device-data/device-data/device-operation-card/provider/device-operation-card';
import { DeviceOperationCardHandlerUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-handler';
import { DeviceServiceRepositoryProvider } from '@pos/device/device-data/device-data/device-service/provider/device-service';
import { DeviceServiceHandlerUseCase } from '@pos/device/device-data/device-data/device-service/use-case/device-service-handler';
import { DeviceProgramTypeRepositoryProvider } from '@pos/device/device-data/device-data/device-program/device-program-type/provider/device-program-type';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { DeviceProgramRepositoryProvider } from '@pos/device/device-data/device-data/device-program/device-program/provider/device-program';
import { DeviceProgramHandlerUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-handler';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { DeviceOperationRepositoryProvider } from '@pos/device/device-data/device-data/device-operation/provider/device-operation';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { DeviceOperationHandlerUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-handler';
import { CreateDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-create';
import { CronDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-cron';
import { HandlerDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-handler';
import { DeviceDataRawRepositoryProvider } from '@pos/device/device-data/device-data-raw/provider/device-data-raw';
import { BullModule } from '@nestjs/bullmq';
import { DataByDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data-by-device';
import { DataByDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data-by-device';
import { FileModule } from '@libs/file/module';
import { PosChemistryProductionUseCase } from '@pos/pos/use-cases/pos-chemistry-production';
import { ConnectionPosDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-connection-pos';
import { FindMethodsDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-find-methods';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';
import { FindMethodsDeviceOperationCardUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods';
import { GetAllTimeStampDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-get-all-time-stamp';
import { CreateDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-create';
import { CleanDataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-clean-data';
import { SuspiciouslyDataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-suspiciously-data';
import { MonthlyPlanPosProvider } from '@pos/monthlyPlanPos/provider/monthlyPlanPos';
import { FindMethodsMonthlyPlanPosUseCase } from '@pos/monthlyPlanPos/use-cases/monthlyPlanPos-find-methods';
import { PlanFactPosUseCase } from '@pos/pos/use-cases/pos-plan-fact';
import {
  DeviceProgramChangeRepositoryProvider
} from "@pos/device/device-data/device-data/device-program/device-program-change/provider/device-program-change";
import {
  FindMethodsDeviceProgramChangeUseCase
} from "@pos/device/device-data/device-data/device-program/device-program-change/use-case/device-program-change-find-methods";
import { TestDataCron } from "../../../infra/handler/testData/cron/testData";
import { ScheduleModule } from "@nestjs/schedule";
import { ConnectionPosWorkerUseCase } from "@pos/pos/use-cases/pos-worker-connection";
import { HrCoreModule } from "@hr/hr-core.module";
import { CarStatisticPosUseCase } from "@pos/pos/use-cases/pos-car-statistic";

const repositories: Provider[] = [
  PosRepositoryProvider,
  CarWashPosProvider,
  CarWashDeviceRepositoryProvider,
  CarWashDeviceTypeRepositoryProvider,
  CurrencyCarWashPosRepositoryProvider,
  CurrencyRepositoryProvide,
  DeviceEventTypeRepositoryProvider,
  DeviceEventRepositoryProvider,
  DeviceMfuRepositoryProvider,
  DeviceOperationCardRepositoryProvider,
  DeviceServiceRepositoryProvider,
  DeviceProgramTypeRepositoryProvider,
  DeviceProgramChangeRepositoryProvider,
  DeviceProgramRepositoryProvider,
  DeviceOperationRepositoryProvider,
  DeviceDataRawRepositoryProvider,
  MonthlyPlanPosProvider,
];

const posUseCase: Provider[] = [
  CreatePosUseCase,
  MonitoringPosUseCase,
  MonitoringFullByIdPosUseCase,
  ProgramPosUseCase,
  PosProgramFullUseCase,
  FindMethodsPosUseCase,
  PosChemistryProductionUseCase,
  ConnectionPosWorkerUseCase,
  CarStatisticPosUseCase,
];

const monthlyPlanPos: Provider[] = [
  FindMethodsMonthlyPlanPosUseCase,
  PlanFactPosUseCase,
];

const carWashPosUseCase: Provider[] = [FindMethodsCarWashPosUseCase];

const deviceUseCase: Provider[] = [
  CreateCarWashDeviceUseCase,
  FindMethodsCarWashDeviceUseCase,
];

const deviceTypeUseCase: Provider[] = [
  CreateCarWashDeviceTypeUseCase,
  UpdateCarWashDeviceTypeUseCase,
  FindMethodsCarWashDeviceTypeUseCase,
];

const currencyUseCase: Provider[] = [
  CurrencyCreate,
  FindMethodsCurrencyUseCase,
];

const deviceDataHandlerUseCase: Provider[] = [
  DeviceEventHandlerUseCase,
  DeviceMfuHandlerUseCase,
  DeviceOperationCardHandlerUseCase,
  DeviceServiceHandlerUseCase,
  FindMethodsDeviceProgramTypeUseCase,
  ConnectionPosDeviceProgramTypeUseCase,
  DeviceProgramHandlerUseCase,
  DeviceOperationHandlerUseCase,
  FindMethodsDeviceEventUseCase,
  GetAllTimeStampDeviceEventUseCase,
  CreateDeviceEventUseCase,
  FindMethodsDeviceProgramChangeUseCase,
];

const deviceDataUseCase: Provider[] = [
  DataByDeviceProgramUseCase,
  DataByDeviceOperationUseCase,
  FindMethodsDeviceProgramUseCase,
  FindMethodsDeviceOperationUseCase,
  CountCarDeviceProgramUseCase,
  FindMethodsDeviceOperationCardUseCase,
  CleanDataDeviceProgramUseCase,
  SuspiciouslyDataDeviceProgramUseCase,
];

const deviceDataRawHandlerUseCase: Provider[] = [
  CreateDeviceDataRawUseCase,
  CronDeviceDataRawUseCase,
  HandlerDeviceDataRawUseCase,
];
@Module({
  imports: [
    PrismaModule,
    AddressModule,
    HrCoreModule,
    FileModule,
    BullModule.registerQueue({
      configKey: 'data_raw',
      name: 'deviceDataRaw',
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    ...repositories,
    ...carWashPosUseCase,
    ...posUseCase,
    ...deviceUseCase,
    ...deviceTypeUseCase,
    ...currencyUseCase,
    ...deviceDataHandlerUseCase,
    ...deviceDataRawHandlerUseCase,
    ...deviceDataUseCase,
    ...monthlyPlanPos,
  ],
  exports: [
    ...carWashPosUseCase,
    ...posUseCase,
    ...deviceUseCase,
    ...deviceDataRawHandlerUseCase,
    ...deviceDataUseCase,
    ...deviceTypeUseCase,
    ...deviceDataHandlerUseCase,
    ...monthlyPlanPos,
    ...currencyUseCase,
  ],
})
export class PosModule {}
