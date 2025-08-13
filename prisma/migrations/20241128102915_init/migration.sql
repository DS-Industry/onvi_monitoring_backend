-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "managerId" INTEGER,
    "posId" INTEGER,
    "createdById" INTEGER NOT NULL,
    "updateById" INTEGER NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerCategoryId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CarWashDeviceProgramsTypeToCarWashPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_ownerCategoryId_key" ON "Category"("ownerCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashDeviceProgramsTypeToCarWashPos_AB_unique" ON "_CarWashDeviceProgramsTypeToCarWashPos"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashDeviceProgramsTypeToCarWashPos_B_index" ON "_CarWashDeviceProgramsTypeToCarWashPos"("B");

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ownerCategoryId_fkey" FOREIGN KEY ("ownerCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceProgramsTypeToCarWashPos" ADD CONSTRAINT "_CarWashDeviceProgramsTypeToCarWashPos_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceProgramsTypeToCarWashPos" ADD CONSTRAINT "_CarWashDeviceProgramsTypeToCarWashPos_B_fkey" FOREIGN KEY ("B") REFERENCES "CarWashPos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
