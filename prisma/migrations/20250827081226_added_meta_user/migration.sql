-- CreateTable
CREATE TABLE "LTYUserMeta" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,

    CONSTRAINT "LTYUserMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LTYUserMeta_clientId_key" ON "LTYUserMeta"("clientId");

-- AddForeignKey
ALTER TABLE "LTYUserMeta" ADD CONSTRAINT "LTYUserMeta_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "LTYUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
