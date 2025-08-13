-- CreateEnum
CREATE TYPE "OrderHandlerStatus" AS ENUM ('CREATED', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "OrderMobileUser" ADD COLUMN     "handlerError" TEXT,
ADD COLUMN     "orderHandlerStatus" "OrderHandlerStatus";
