-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "confirmCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phone_key" ON "Otp"("phone");
