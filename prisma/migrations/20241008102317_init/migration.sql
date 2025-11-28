-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "PositionUser" AS ENUM ('Owner', 'Operator');

-- CreateEnum
CREATE TYPE "StatusOrganization" AS ENUM ('VERIFICATE', 'PENDING', 'ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "StatusPos" AS ENUM ('VERIFICATE', 'ACTIVE', 'OFFLINE', 'DELETED');

-- CreateEnum
CREATE TYPE "CarWashPosType" AS ENUM ('SelfService', 'Portal', 'SelfServiceAndPortal');

-- CreateEnum
CREATE TYPE "TypeOrganization" AS ENUM ('LegalEntity', 'IndividualEntrepreneur');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('CASH', 'CASHLESS', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "CurrencyView" AS ENUM ('COIN', 'PAPER');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('manage', 'create', 'update', 'delete', 'read');

-- CreateEnum
CREATE TYPE "StatusDeviceDataRaw" AS ENUM ('NEW', 'PENDING', 'DONE');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "organizationDocumentId" INTEGER,
    "organizationStatus" "StatusOrganization" NOT NULL,
    "organizationType" "TypeOrganization" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" INTEGER,
    "lon" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDocument" (
    "id" SERIAL NOT NULL,
    "rateVat" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "okpo" TEXT NOT NULL,
    "kpp" TEXT,
    "ogrn" TEXT NOT NULL,
    "bik" TEXT NOT NULL,
    "correspondentAccount" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "settlementAccount" TEXT NOT NULL,
    "addressBank" TEXT NOT NULL,
    "documentDoc" TEXT,
    "certificateNumber" TEXT,
    "dateCertificate" TIMESTAMP(3),

    CONSTRAINT "OrganizationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMailConfirm" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "confirmString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMailConfirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userRoleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT,
    "birthday" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "position" "PositionUser" DEFAULT 'Operator',
    "status" "StatusUser" DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" INTEGER NOT NULL,
    "timezone" INTEGER NOT NULL,
    "refreshTokenId" TEXT,
    "receiveNotifications" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" SERIAL NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "objectId" INTEGER NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevicePermissions" (
    "id" SERIAL NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "objectId" INTEGER,

    CONSTRAINT "DevicePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectPermissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ObjectPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pos" (
    "id" SERIAL NOT NULL,
    "loyaltyProgramId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "monthlyPlan" INTEGER,
    "timeWork" TEXT NOT NULL DEFAULT '24',
    "organizationId" INTEGER NOT NULL,
    "posMetaData" TEXT,
    "timezone" INTEGER NOT NULL,
    "addressId" INTEGER,
    "image" TEXT,
    "rating" INTEGER,
    "status" "StatusPos" NOT NULL DEFAULT 'VERIFICATE',
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
    "carWashPosType" "CarWashPosType" NOT NULL DEFAULT 'SelfService',
    "minSumOrder" INTEGER NOT NULL DEFAULT 50,
    "maxSumOrder" INTEGER NOT NULL DEFAULT 500,
    "stepSumOrder" INTEGER NOT NULL DEFAULT 10,

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
    "carWashPosId" INTEGER NOT NULL,
    "deviceRoleId" INTEGER,

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
CREATE TABLE "DeviceApiKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "DeviceApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceOperationsEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "counter" INTEGER NOT NULL,
    "operSum" INTEGER NOT NULL,
    "confirm" INTEGER NOT NULL,
    "isAgregate" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "isBoxOffice" INTEGER NOT NULL,
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceOperationsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceOperationsCardEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "operDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "sum" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "operId" INTEGER NOT NULL,
    "discountSum" INTEGER NOT NULL,
    "totalSum" INTEGER,
    "isBonus" INTEGER,
    "currency" "CurrencyType" NOT NULL,
    "cashback" INTEGER,
    "cashbackPercent" INTEGER,
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceOperationsCardEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceProgramsEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "carWashDeviceProgramsTypeId" INTEGER,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "confirm" INTEGER NOT NULL,
    "isPaid" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "isAgregate" INTEGER,
    "minute" DECIMAL(65,30),
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceProgramsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceProgramsType" (
    "id" SERIAL NOT NULL,
    "carWashDeviceTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "orderNum" INTEGER,

    CONSTRAINT "CarWashDeviceProgramsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "carWashDeviceEventTypeId" INTEGER,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceEventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CarWashDeviceEventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceServiceEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "carWashDeviceProgramsTypeId" INTEGER,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "counter" INTEGER NOT NULL,
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceServiceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarWashDeviceMfuEvent" (
    "id" SERIAL NOT NULL,
    "carWashDeviceId" INTEGER,
    "cashIn" INTEGER NOT NULL,
    "coinOut" INTEGER NOT NULL,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "loadDate" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "errNumId" INTEGER,

    CONSTRAINT "CarWashDeviceMfuEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currencyType" "CurrencyType" NOT NULL,
    "currencyView" "CurrencyView",

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyCarWashPos" (
    "id" SERIAL NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "carWashDeviceTypeId" INTEGER NOT NULL,
    "coef" INTEGER NOT NULL,
    "carWashPosId" INTEGER NOT NULL,

    CONSTRAINT "CurrencyCarWashPos_pkey" PRIMARY KEY ("id")
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
    "email" TEXT,
    "gender" TEXT,
    "status" "StatusUser" DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "country" TEXT,
    "countryCode" INTEGER,
    "timezone" INTEGER,
    "refreshTokenId" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "loyaltyCardId" INTEGER,
    "mobileUserRoleId" INTEGER,

    CONSTRAINT "MobileUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "confirmCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
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
    "status" "StatusUser" DEFAULT 'ACTIVE',
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
CREATE TABLE "PlatformUserMailConfirm" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "confirmString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformUserMailConfirm_pkey" PRIMARY KEY ("id")
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
    "action" "PermissionAction" NOT NULL,
    "objectId" INTEGER NOT NULL,

    CONSTRAINT "PlatformUserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceDataRaw" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "errors" TEXT,
    "status" "StatusDeviceDataRaw" NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countRow" INTEGER,
    "countError" INTEGER,

    CONSTRAINT "DeviceDataRaw_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_DevicePermissionsToDeviceRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PosToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CarWashPosToCarWashService" (
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
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_organizationDocumentId_key" ON "Organization"("organizationDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMailConfirm_email_key" ON "OrganizationMailConfirm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserMailConfirm_email_key" ON "UserMailConfirm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pos_addressId_key" ON "Pos"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "CarWashPos_posId_key" ON "CarWashPos"("posId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

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
CREATE UNIQUE INDEX "Otp_phone_key" ON "Otp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_phone_key" ON "PlatformUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_email_key" ON "PlatformUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUserMailConfirm_email_key" ON "PlatformUserMailConfirm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUser_AB_unique" ON "_OrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "_OrganizationToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPermissionToUserRole_AB_unique" ON "_UserPermissionToUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPermissionToUserRole_B_index" ON "_UserPermissionToUserRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DevicePermissionsToDeviceRole_AB_unique" ON "_DevicePermissionsToDeviceRole"("A", "B");

-- CreateIndex
CREATE INDEX "_DevicePermissionsToDeviceRole_B_index" ON "_DevicePermissionsToDeviceRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PosToUser_AB_unique" ON "_PosToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PosToUser_B_index" ON "_PosToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CarWashPosToCarWashService_AB_unique" ON "_CarWashPosToCarWashService"("A", "B");

-- CreateIndex
CREATE INDEX "_CarWashPosToCarWashService_B_index" ON "_CarWashPosToCarWashService"("B");

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
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_organizationDocumentId_fkey" FOREIGN KEY ("organizationDocumentId") REFERENCES "OrganizationDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMailConfirm" ADD CONSTRAINT "OrganizationMailConfirm_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectPermissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePermissions" ADD CONSTRAINT "DevicePermissions_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectPermissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_loyaltyProgramId_fkey" FOREIGN KEY ("loyaltyProgramId") REFERENCES "LoyaltyProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashPos" ADD CONSTRAINT "CarWashPos_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDevice" ADD CONSTRAINT "CarWashDevice_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDevice" ADD CONSTRAINT "CarWashDevice_carWashPosId_fkey" FOREIGN KEY ("carWashPosId") REFERENCES "CarWashPos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDevice" ADD CONSTRAINT "CarWashDevice_deviceRoleId_fkey" FOREIGN KEY ("deviceRoleId") REFERENCES "DeviceRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceApiKey" ADD CONSTRAINT "DeviceApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsEvent" ADD CONSTRAINT "CarWashDeviceOperationsEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsEvent" ADD CONSTRAINT "CarWashDeviceOperationsEvent_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsEvent" ADD CONSTRAINT "CarWashDeviceOperationsEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsCardEvent" ADD CONSTRAINT "CarWashDeviceOperationsCardEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceOperationsCardEvent" ADD CONSTRAINT "CarWashDeviceOperationsCardEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgramsEvent" ADD CONSTRAINT "CarWashDeviceProgramsEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgramsEvent" ADD CONSTRAINT "CarWashDeviceProgramsEvent_carWashDeviceProgramsTypeId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgramsEvent" ADD CONSTRAINT "CarWashDeviceProgramsEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceProgramsType" ADD CONSTRAINT "CarWashDeviceProgramsType_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceEvent" ADD CONSTRAINT "CarWashDeviceEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceEvent" ADD CONSTRAINT "CarWashDeviceEvent_carWashDeviceEventTypeId_fkey" FOREIGN KEY ("carWashDeviceEventTypeId") REFERENCES "CarWashDeviceEventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceEvent" ADD CONSTRAINT "CarWashDeviceEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceServiceEvent" ADD CONSTRAINT "CarWashDeviceServiceEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceServiceEvent" ADD CONSTRAINT "CarWashDeviceServiceEvent_carWashDeviceProgramsTypeId_fkey" FOREIGN KEY ("carWashDeviceProgramsTypeId") REFERENCES "CarWashDeviceProgramsType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceServiceEvent" ADD CONSTRAINT "CarWashDeviceServiceEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceMfuEvent" ADD CONSTRAINT "CarWashDeviceMfuEvent_carWashDeviceId_fkey" FOREIGN KEY ("carWashDeviceId") REFERENCES "CarWashDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarWashDeviceMfuEvent" ADD CONSTRAINT "CarWashDeviceMfuEvent_errNumId_fkey" FOREIGN KEY ("errNumId") REFERENCES "ErrNum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyCarWashPos" ADD CONSTRAINT "CurrencyCarWashPos_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyCarWashPos" ADD CONSTRAINT "CurrencyCarWashPos_carWashDeviceTypeId_fkey" FOREIGN KEY ("carWashDeviceTypeId") REFERENCES "CarWashDeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyCarWashPos" ADD CONSTRAINT "CurrencyCarWashPos_carWashPosId_fkey" FOREIGN KEY ("carWashPosId") REFERENCES "CarWashPos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_loyaltyCardId_fkey" FOREIGN KEY ("loyaltyCardId") REFERENCES "LoyaltyCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileUser" ADD CONSTRAINT "MobileUser_mobileUserRoleId_fkey" FOREIGN KEY ("mobileUserRoleId") REFERENCES "MobileUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUser" ADD CONSTRAINT "PlatformUser_platformUserRoleId_fkey" FOREIGN KEY ("platformUserRoleId") REFERENCES "PlatformUserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserPermission" ADD CONSTRAINT "PlatformUserPermission_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectPermissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "UserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPermissionToUserRole" ADD CONSTRAINT "_UserPermissionToUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DevicePermissionsToDeviceRole" ADD CONSTRAINT "_DevicePermissionsToDeviceRole_A_fkey" FOREIGN KEY ("A") REFERENCES "DevicePermissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DevicePermissionsToDeviceRole" ADD CONSTRAINT "_DevicePermissionsToDeviceRole_B_fkey" FOREIGN KEY ("B") REFERENCES "DeviceRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PosToUser" ADD CONSTRAINT "_PosToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PosToUser" ADD CONSTRAINT "_PosToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashPosToCarWashService" ADD CONSTRAINT "_CarWashPosToCarWashService_A_fkey" FOREIGN KEY ("A") REFERENCES "CarWashPos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarWashPosToCarWashService" ADD CONSTRAINT "_CarWashPosToCarWashService_B_fkey" FOREIGN KEY ("B") REFERENCES "CarWashService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
