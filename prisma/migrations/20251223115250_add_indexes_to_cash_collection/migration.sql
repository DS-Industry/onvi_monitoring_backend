-- CreateIndex
CREATE INDEX "CarWashDeviceOperationsEvent_carWashDeviceId_operDate_curre_idx" ON "CarWashDeviceOperationsEvent"("carWashDeviceId", "operDate", "currencyId");

-- CreateIndex
CREATE INDEX "CashCollection_status_sendAt_idx" ON "CashCollection"("status", "sendAt");

-- CreateIndex
CREATE INDEX "CashCollection_posId_status_idx" ON "CashCollection"("posId", "status");

-- CreateIndex
CREATE INDEX "CashCollectionDevice_cashCollectionId_idx" ON "CashCollectionDevice"("cashCollectionId");

-- CreateIndex
CREATE INDEX "CashCollectionDevice_carWashDeviceId_idx" ON "CashCollectionDevice"("carWashDeviceId");

-- CreateIndex
CREATE INDEX "CashCollectionDeviceType_cashCollectionId_idx" ON "CashCollectionDeviceType"("cashCollectionId");
