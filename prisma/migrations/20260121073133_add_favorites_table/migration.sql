-- CreateTable
CREATE TABLE "LTYUserFavorites" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "posId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LTYUserFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LTYUserFavorites_clientId_idx" ON "LTYUserFavorites"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "LTYUserFavorites_clientId_posId_key" ON "LTYUserFavorites"("clientId", "posId");

-- AddForeignKey
ALTER TABLE "LTYUserFavorites" ADD CONSTRAINT "LTYUserFavorites_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYUserFavorites" ADD CONSTRAINT "LTYUserFavorites_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
