-- CreateEnum
CREATE TYPE "StatusPlatformAdmin" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "organizationDocuments" TEXT NOT NULL,
    "organizationStatus" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userRoleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" INTEGER NOT NULL,
    "timezone" INTEGER NOT NULL,
    "refreshTokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissionModule" TEXT NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pos" (
    "id" SERIAL NOT NULL,
    "loyaltyProgramId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "monthlyPlan" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "posMetaData" TEXT NOT NULL,
    "timezone" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updateById" INTEGER NOT NULL,

    CONSTRAINT "Pos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashPos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "posId" INTEGER NOT NULL,

    CONSTRAINT "CarWashPos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashService" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CarWashService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDevice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "carWashDeviceMetaData" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "carWashDeviceTypeId" INTEGER NOT NULL,

    CONSTRAINT "CarWashDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "CarWashDeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceOperationsEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "counter" INTEGER NOT NULL,
    "operSum" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "localId" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "isBoxOffice" BOOLEAN NOT NULL,

    CONSTRAINT "CarWashDeviceOperationsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceProgrammsEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "carWashDeviceOperationsEventId" INTEGER NOT NULL,
    "carWashDeviceProgrammsTypeId" INTEGER NOT NULL,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "beginConfirm" BOOLEAN NOT NULL,
    "endConfirm" BOOLEAN NOT NULL,
    "isPaid" INTEGER NOT NULL,
    "beginLocalId" INTEGER NOT NULL,
    "endLocalId" INTEGER NOT NULL,
    "crdOper" INTEGER NOT NULL,
    "uncNumber" INTEGER NOT NULL,

    CONSTRAINT "CarWashDeviceProgrammsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceProgrammsType" (
    "id" SERIAL NOT NULL,
    "carWashDeviceTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "CarWashDeviceProgrammsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER NOT NULL,
    "carWashDeviceEventTypeId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,

    CONSTRAINT "CarWashDeviceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceEventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "CarWashDeviceEventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrNum" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "ErrNum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyProgram" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LoyaltyProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosBenefit" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,

    CONSTRAINT "PosBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyPosPromocode" (
    "id" SERIAL NOT NULL,
    "posId" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "metaData" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "discountType" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyPosPromocode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromocodeTransaction" (
    "id" SERIAL NOT NULL,
    "loyaltyPosPromocodeId" INTEGER NOT NULL,
    "mobileUserId" INTEGER NOT NULL,
    "activationDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PromocodeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benefit" (
    "id" SERIAL NOT NULL,
    "benefitTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bonus" TEXT NOT NULL,
    "benefitActionTypeId" INTEGER NOT NULL,
    "posBenefitId" INTEGER NOT NULL,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenefitType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bonus" TEXT NOT NULL,
    "posBenefitId" INTEGER NOT NULL,

    CONSTRAINT "BenefitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenefitActionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BenefitActionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyCard" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL,
    "statuc" TEXT NOT NULL,
    "dateBegin" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "loyaltyCardTierId" INTEGER NOT NULL,
    "uncNumber" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "LoyaltyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyCardTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "loyaltyProgramId" INTEGER NOT NULL,

    CONSTRAINT "LoyaltyCardTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "middlename" TEXT,
    "birthday" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "avatar" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" INTEGER NOT NULL,
    "timezone" INTEGER NOT NULL,
    "refreshTokenId" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "loyaltyCardId" INTEGER NOT NULL,
    "mobileUserRoleId" INTEGER NOT NULL,

    CONSTRAINT "MobileUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileUserRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MobileUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileUserPermission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissionModule" TEXT NOT NULL,

    CONSTRAINT "MobileUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT,
    "birthday" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "status" "StatusPlatformAdmin" NOT NULL DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" INTEGER NOT NULL,
    "timezone" INTEGER NOT NULL,
    "refreshTokenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "platformUserRoleId" INTEGER,

    CONSTRAINT "PlatformUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformUserRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PlatformUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformUserPermission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissionModule" TEXT NOT NULL,

    CONSTRAINT "PlatformUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserPermissionToUserRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashPosToCarWashService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashDeviceToCarWashPos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashDeviceOperationsEventToErrNum" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashDeviceProgrammsEventToErrNum" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashDeviceEventToErrNum" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BenefitToLoyaltyCardTier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MobileUserPermissionToMobileUserRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlatformUserPermissionToPlatformUserRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_addressId_key" ON "Organization"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pos_addressId_key" ON "Pos"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashPos_posId_key" ON "CarWashPos"("posId");

-- CreateIndex
CREATE UNIQUE INDEX "PosBenefit_posId_key" ON "PosBenefit"("posId");

-- CreateIndex
CREATE UNIQUE INDEX "PromocodeTransaction_loyaltyPosPromocodeId_key" ON "PromocodeTransaction"("loyaltyPosPromocodeId");

-- CreateIndex
CREATE UNIQUE INDEX "PromocodeTransaction_mobileUserId_key" ON "PromocodeTransaction"("mobileUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileUser_phone_key" ON "MobileUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MobileUser_email_key" ON "MobileUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MobileUser_loyaltyCardId_key" ON "MobileUser"("loyaltyCardId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_phone_key" ON "PlatformUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_email_key" ON "PlatformUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUser_AB_unique" ON "_OrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "_OrganizationToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPermissionToUserRole_AB_unique" ON "_UserPermissionToUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPermissionToUserRole_B_index" ON "_UserPermissionToUserRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashPosToCarWashService_AB_unique" ON "_CarWashPosToCarWashService"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashPosToCarWashService_B_index" ON "_CarWashPosToCarWashService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashDeviceToCarWashPos_AB_unique" ON "_CarWashDeviceToCarWashPos"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashDeviceToCarWashPos_B_index" ON "_CarWashDeviceToCarWashPos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashDeviceOperationsEventToErrNum_AB_unique" ON "_CarWashDeviceOperationsEventToErrNum"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashDeviceOperationsEventToErrNum_B_index" ON "_CarWashDeviceOperationsEventToErrNum"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashDeviceProgrammsEventToErrNum_AB_unique" ON "_CarWashDeviceProgrammsEventToErrNum"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashDeviceProgrammsEventToErrNum_B_index" ON "_CarWashDeviceProgrammsEventToErrNum"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashDeviceEventToErrNum_AB_unique" ON "_CarWashDeviceEventToErrNum"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashDeviceEventToErrNum_B_index" ON "_CarWashDeviceEventToErrNum"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BenefitToLoyaltyCardTier_AB_unique" ON "_BenefitToLoyaltyCardTier"("A", "B");

-- CreateIndex
CREATE INDEX "_BenefitToLoyaltyCardTier_B_index" ON "_BenefitToLoyaltyCardTier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MobileUserPermissionToMobileUserRole_AB_unique" ON "_MobileUserPermissionToMobileUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_MobileUserPermissionToMobileUserRole_B_index" ON "_MobileUserPermissionToMobileUserRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlatformUserPermissionToPlatformUserRole_AB_unique" ON "_PlatformUserPermissionToPlatformUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PlatformUserPermissionToPlatformUserRole_B_index" ON "_PlatformUserPermissionToPlatformUserRole"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashPos" ADD CONSTRAINT "CarWashPos_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDevice" ADD CONSTRAINT "CarWashDevice_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsEvent" ADD CONSTRAINT "CarWashDeviceOperationsEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgrammsEvent" ADD CONSTRAINT "CarWashDeviceProgrammsEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgrammsEvent" ADD CONSTRAINT "CarWashDeviceProgrammsEvent_carWashDeviceOperationsEventId_fkey" FOREIGN KEY ("carWashDeviceOperationsEventId") REFERENCES "CarWashDeviceOperationsEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgrammsEvent" ADD CONSTRAINT "CarWashDeviceProgrammsEvent_carWashDeviceProgrammsTypeId_fkey" FOREIGN KEY ("carWashDeviceProgrammsTypeId") REFERENCES "CarWashDeviceProgrammsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgrammsType" ADD CONSTRAINT "CarWashDeviceProgrammsType_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceEvent" ADD CONSTRAINT "CarWashDeviceEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceEvent" ADD CONSTRAINT "CarWashDeviceEvent_carWashDeviceEventTypeId_fkey" FOREIGN KEY ("carWashDeviceEventTypeId") REFERENCES "CarWashDeviceEventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosBenefit" ADD CONSTRAINT "PosBenefit_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPosPromocode" ADD CONSTRAINT "LoyaltyPosPromocode_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocodeTransaction" ADD CONSTRAINT "PromocodeTransaction_loyaltyPosPromocodeId_fkey" FOREIGN KEY ("loyaltyPosPromocodeId") REFERENCES "LoyaltyPosPromocode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocodeTransaction" ADD CONSTRAINT "PromocodeTransaction_mobileUserId_fkey" FOREIGN KEY ("mobileUserId") REFERENCES "MobileUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_benefitTypeId_fkey" FOREIGN KEY ("benefitTypeId") REFERENCES "BenefitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_benefitActionTypeId_fkey" FOREIGN KEY ("benefitActionTypeId") REFERENCES "BenefitActionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_posBenefitId_fkey" FOREIGN KEY ("posBenefitId") REFERENCES "PosBenefit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenefitType" ADD CONSTRAINT "BenefitType_posBenefitId_fkey" FOREIGN KEY ("posBenefitId") REFERENCES "PosBenefit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyCard" ADD CONSTRAINT "LoyaltyCard_loyaltyCardTierId_fkey" FOREIGN KEY ("loyaltyCardTierId") REFERENCES "LoyaltyCardTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyCardTier" ADD CONSTRAINT "LoyaltyCardTier_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_loyaltyCardId_fkey" FOREIGN KEY ("loyaltyCardId") REFERENCES "LoyaltyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_mobileUserRoleId_fkey" FOREIGN KEY ("mobileUserRoleId") REFERENCES "MobileUserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUser" ADD CONSTRAINT "PlatformUser_platformUserRoleId_fkey" FOREIGN KEY ("platformUserRoleId") REFERENCES "PlatformUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "UserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashPosToCarWashService" ADD CONSTRAINT "_CarWashPosToCarWashService_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashPos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashPosToCarWashService" ADD CONSTRAINT "_CarWashPosToCarWashService_B_fkey" FOREIGN KEY ("B") REFERENCES "CarWashService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceToCarWashPos" ADD CONSTRAINT "_CarWashDeviceToCarWashPos_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceToCarWashPos" ADD CONSTRAINT "_CarWashDeviceToCarWashPos_B_fkey" FOREIGN KEY ("B") REFERENCES "CarWashPos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceOperationsEventToErrNum" ADD CONSTRAINT "_CarWashDeviceOperationsEventToErrNum_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashDeviceOperationsEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceOperationsEventToErrNum" ADD CONSTRAINT "_CarWashDeviceOperationsEventToErrNum_B_fkey" FOREIGN KEY ("B") REFERENCES "ErrNum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceProgrammsEventToErrNum" ADD CONSTRAINT "_CarWashDeviceProgrammsEventToErrNum_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashDeviceProgrammsEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceProgrammsEventToErrNum" ADD CONSTRAINT "_CarWashDeviceProgrammsEventToErrNum_B_fkey" FOREIGN KEY ("B") REFERENCES "ErrNum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceEventToErrNum" ADD CONSTRAINT "_CarWashDeviceEventToErrNum_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashDeviceEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashDeviceEventToErrNum" ADD CONSTRAINT "_CarWashDeviceEventToErrNum_B_fkey" FOREIGN KEY ("B") REFERENCES "ErrNum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BenefitToLoyaltyCardTier" ADD CONSTRAINT "_BenefitToLoyaltyCardTier_A_fkey" FOREIGN KEY ("A") REFERENCES "Benefit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BenefitToLoyaltyCardTier" ADD CONSTRAINT "_BenefitToLoyaltyCardTier_B_fkey" FOREIGN KEY ("B") REFERENCES "LoyaltyCardTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MobileUserPermissionToMobileUserRole" ADD CONSTRAINT "_MobileUserPermissionToMobileUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "MobileUserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MobileUserPermissionToMobileUserRole" ADD CONSTRAINT "_MobileUserPermissionToMobileUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "MobileUserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatformUserPermissionToPlatformUserRole" ADD CONSTRAINT "_PlatformUserPermissionToPlatformUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "PlatformUserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatformUserPermissionToPlatformUserRole" ADD CONSTRAINT "_PlatformUserPermissionToPlatformUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "PlatformUserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
