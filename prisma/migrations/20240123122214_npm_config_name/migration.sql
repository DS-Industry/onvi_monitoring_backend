-- CreateTable
CREATE TABLE "UserPermission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissionModule" TEXT NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPermissionToUserRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserPermissionToUserRole_AB_unique" ON "_UserPermissionToUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPermissionToUserRole_B_index" ON "_UserPermissionToUserRole"("B");

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "UserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
