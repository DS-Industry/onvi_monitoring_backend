/*
  Warnings:

  - A unique constraint covering the columns `[paymentGatewayId]` on the table `LTYEquaring` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LTYEquaring_paymentGatewayId_key" ON "LTYEquaring"("paymentGatewayId");
