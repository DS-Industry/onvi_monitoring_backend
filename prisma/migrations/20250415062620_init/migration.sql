-- CreateTable
CREATE TABLE "HrWorker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hrPositionId" INTEGER NOT NULL,
    "startWorkDate" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "monthlySalary" INTEGER NOT NULL,
    "dailySalary" INTEGER NOT NULL,
    "percentageSalary" INTEGER NOT NULL,
    "gender" TEXT,
    "citizenship" TEXT,
    "passportSeries" TEXT,
    "passportNumber" TEXT,
    "passportExtradition" TEXT,
    "passportDateIssue" TIMESTAMP(3),
    "inn" TEXT,
    "snils" TEXT,

    CONSTRAINT "HrWorker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrPosition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "HrPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HrWorker" ADD CONSTRAINT "HrWorker_hrPositionId_fkey" FOREIGN KEY ("hrPositionId") REFERENCES "HrPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
