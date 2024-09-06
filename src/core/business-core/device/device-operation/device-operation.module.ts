import { Module } from '@nestjs/common';
import { DeviceOperationRepositoryProvider } from '@device/device-operation/provider/device-operation';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceOperationHandlerUseCase } from '@device/device-operation/use-cases/device-operation-handler';
import { DeviceModule } from '@device/device/device.module';
import { CurrencyCarWashPosModule } from '@device/currency/currency-car-wash-pos/currency-car-wash-pos.module';
import { CreateDeviceOperationUseCase } from '@device/device-operation/use-cases/device-operation-create';
import { DeviceOperationGetSumByCurTypeAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-sum-by-cur-type-and-date';
import { DeviceOperationGetAllByCurTypeAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-cur-type-and-date';
import { GetAllSumOperByCurTypeAndDateCarWashDeviceUseCase } from '@device/device-operation/use-cases/car-wash-device-get-all-sum-oper-by-cur-type-and-date';
import { DeviceOperationGetAllByPosIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-pos-id-and-date';
import { CurrencyModule } from '@device/currency/currency/currency.module';
import { GetDataByPosIdResponseDeviceOperationUseCase } from '@device/device-operation/use-cases/device-operation-get-data-by-pos-id-response';
import { DeviceOperationGetAllByDeviceIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-device-id-and-date';
import { GetFullDataByPosIdDeviceOperationResponseUseCase } from '@device/device-operation/use-cases/device-operation-get-full-data-by-pos-id-response';
import { DeviceOperationGetLastOperByPosIdUseCase } from '@device/device-operation/use-cases/device-operation-get-last-oper-by-pos-id';
import { DeviceOperationGetLastOperByDeviceIdUseCase } from '@device/device-operation/use-cases/device-operation-get-last-oper-by-device-id';
import { DeviceOperationGetAllByOrgIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-org-id-and-date';

@Module({
  imports: [
    PrismaModule,
    DeviceModule,
    CurrencyCarWashPosModule,
    CurrencyModule,
  ],
  providers: [
    DeviceOperationRepositoryProvider,
    DeviceOperationHandlerUseCase,
    CreateDeviceOperationUseCase,
    DeviceOperationGetSumByCurTypeAndDateUseCase,
    DeviceOperationGetAllByCurTypeAndDateUseCase,
    GetAllSumOperByCurTypeAndDateCarWashDeviceUseCase,
    DeviceOperationGetAllByPosIdAndDateUseCase,
    GetDataByPosIdResponseDeviceOperationUseCase,
    DeviceOperationGetAllByDeviceIdAndDateUseCase,
    GetFullDataByPosIdDeviceOperationResponseUseCase,
    DeviceOperationGetLastOperByPosIdUseCase,
    DeviceOperationGetLastOperByDeviceIdUseCase,
    DeviceOperationGetAllByOrgIdAndDateUseCase,
  ],
  exports: [
    CurrencyModule,
    DeviceOperationHandlerUseCase,
    DeviceOperationGetSumByCurTypeAndDateUseCase,
    DeviceOperationGetAllByCurTypeAndDateUseCase,
    GetAllSumOperByCurTypeAndDateCarWashDeviceUseCase,
    DeviceOperationGetAllByPosIdAndDateUseCase,
    GetDataByPosIdResponseDeviceOperationUseCase,
    DeviceOperationGetAllByDeviceIdAndDateUseCase,
    GetFullDataByPosIdDeviceOperationResponseUseCase,
    DeviceOperationGetAllByOrgIdAndDateUseCase,
  ],
})
export class DeviceOperationModule {}
