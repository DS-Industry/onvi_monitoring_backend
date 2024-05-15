-- CreateTable
CREATE TABLE "UserMailConfirm" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "confirmString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMailConfirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformUserMailConfirm" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "confirmString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformUserMailConfirm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMailConfirm_email_key" ON "UserMailConfirm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUserMailConfirm_email_key" ON "PlatformUserMailConfirm"("email");
