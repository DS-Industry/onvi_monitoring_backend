/*
  Warnings:

  - A unique constraint covering the columns `[carWashDeviceId,eventDate,localId]` on the table `CarWashDeviceEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carWashDeviceId,beginDate,endDate,localId]` on the table `CarWashDeviceMfuEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carWashDeviceId,operDate,sum,localId]` on the table `CarWashDeviceOperationsCardEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carWashDeviceId,operDate,operSum,localId]` on the table `CarWashDeviceOperationsEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carWashDeviceId,beginDate,endDate,localId]` on the table `CarWashDeviceProgramsEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carWashDeviceId,beginDate,endDate,localId]` on the table `CarWashDeviceServiceEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceEvent_carWashDeviceId_eventDate_localId_key" ON "CarWashDeviceEvent"("carWashDeviceId", "eventDate", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceMfuEvent_carWashDeviceId_beginDate_endDate_loc_key" ON "CarWashDeviceMfuEvent"("carWashDeviceId", "beginDate", "endDate", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceOperationsCardEvent_carWashDeviceId_operDate_s_key" ON "CarWashDeviceOperationsCardEvent"("carWashDeviceId", "operDate", "sum", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceOperationsEvent_carWashDeviceId_operDate_operS_key" ON "CarWashDeviceOperationsEvent"("carWashDeviceId", "operDate", "operSum", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceProgramsEvent_carWashDeviceId_beginDate_endDat_key" ON "CarWashDeviceProgramsEvent"("carWashDeviceId", "beginDate", "endDate", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashDeviceServiceEvent_carWashDeviceId_beginDate_endDate_key" ON "CarWashDeviceServiceEvent"("carWashDeviceId", "beginDate", "endDate", "localId");
