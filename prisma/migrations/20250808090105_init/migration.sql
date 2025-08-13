-- CreateIndex
CREATE INDEX "CarWashDeviceEvent_carWashDeviceId_eventDate_idx" ON "CarWashDeviceEvent"("carWashDeviceId", "eventDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceEvent_carWashDeviceEventTypeId_eventDate_idx" ON "CarWashDeviceEvent"("carWashDeviceEventTypeId", "eventDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsCardEvent_carWashDeviceId_operDate_idx" ON "CarWashDeviceOperationsCardEvent"("carWashDeviceId", "operDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsCardEvent_cardNumber_operDate_idx" ON "CarWashDeviceOperationsCardEvent"("cardNumber", "operDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsEvent_carWashDeviceId_operDate_idx" ON "CarWashDeviceOperationsEvent"("carWashDeviceId", "operDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsEvent_operDate_operSum_idx" ON "CarWashDeviceOperationsEvent"("operDate" DESC, "operSum");

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsEvent_currencyId_operDate_idx" ON "CarWashDeviceOperationsEvent"("currencyId", "operDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsEvent_confirm_idx" ON "CarWashDeviceOperationsEvent"("confirm");

-- CreateIndex
CREATE INDEX "CarWashDeviceProgramsEvent_carWashDeviceId_beginDate_idx" ON "CarWashDeviceProgramsEvent"("carWashDeviceId", "beginDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceProgramsEvent_carWashDeviceProgramsTypeId_begi_idx" ON "CarWashDeviceProgramsEvent"("carWashDeviceProgramsTypeId", "beginDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceProgramsEvent_confirm_isPaid_idx" ON "CarWashDeviceProgramsEvent"("confirm", "isPaid");

-- CreateIndex
CREATE INDEX "CarWashDeviceServiceEvent_carWashDeviceId_beginDate_idx" ON "CarWashDeviceServiceEvent"("carWashDeviceId", "beginDate" DESC);

-- CreateIndex
CREATE INDEX "CarWashDeviceServiceEvent_carWashDeviceProgramsTypeId_begin_idx" ON "CarWashDeviceServiceEvent"("carWashDeviceProgramsTypeId", "beginDate" DESC);

-- CreateIndex
CREATE INDEX "Placement_country_region_idx" ON "Placement"("country", "region");

-- CreateIndex
CREATE INDEX "Placement_utc_idx" ON "Placement"("utc");

-- CreateIndex
CREATE INDEX "Pos_organizationId_status_idx" ON "Pos"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Pos_placementId_status_idx" ON "Pos"("placementId", "status");

-- CreateIndex
CREATE INDEX "Pos_createdAt_idx" ON "Pos"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Pos_rating_idx" ON "Pos"("rating" DESC);

-- CreateIndex
CREATE INDEX "Pos_status_organizationId_idx" ON "Pos"("status", "organizationId");
