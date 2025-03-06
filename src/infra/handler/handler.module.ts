import { Module, Provider } from '@nestjs/common';
import { HandlerDeviceDataRawCron } from './device-data-raw/cron/handler-device-data-raw';
import { DeviceDataRawConsumer } from './device-data-raw/consumer/device-data-raw.consumer';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HandlerTechTaskCron } from './techTask/cron/handler-techTask';
import { EquipmentCoreModule } from '../../core/equipment-core/equipment-core.module';
import { ReportTemplateConsumer } from './reportTemplate/comsumer/report-template.consumer';
import { ReportCoreModule } from '@report/report-core.module';

const deviceDataRawUseCase: Provider[] = [
  HandlerDeviceDataRawCron,
  DeviceDataRawConsumer,
];

//const reportTemplateUseCase: Provider[] = [ReportTemplateConsumer];

const techTaskUseCase: Provider[] = [HandlerTechTaskCron];

@Module({
  imports: [
    BusinessCoreModule,
    EquipmentCoreModule,
    ScheduleModule,
    ReportCoreModule,
  ],
  providers: [
    ...deviceDataRawUseCase,
    ...techTaskUseCase,
//    ...reportTemplateUseCase,
  ],
  exports: [],
})
export class HandlerModule {}
