-- CreateTable
CREATE TABLE "LTYCorporate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ownerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LTYCorporate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Worker" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Worker_AB_unique" ON "_Worker"("A", "B");

-- CreateIndex
CREATE INDEX "_Worker_B_index" ON "_Worker"("B");

-- AddForeignKey
ALTER TABLE "LTYCorporate" ADD CONSTRAINT "LTYCorporate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "LTYUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Worker" ADD CONSTRAINT "_Worker_A_fkey" FOREIGN KEY ("A") REFERENCES "LTYCorporate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Worker" ADD CONSTRAINT "_Worker_B_fkey" FOREIGN KEY ("B") REFERENCES "LTYUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
