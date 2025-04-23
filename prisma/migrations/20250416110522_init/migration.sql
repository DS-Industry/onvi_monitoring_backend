-- CreateTable
CREATE TABLE "HrPrepayment" (
    "id" SERIAL NOT NULL,
    "hrWorkerId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "billingMonth" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "HrPrepayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrPayment" (
    "id" SERIAL NOT NULL,
    "hrWorkerId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "billingMonth" TIMESTAMP(3) NOT NULL,
    "sum" INTEGER NOT NULL,
    "prize" INTEGER NOT NULL,
    "fine" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "HrPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HrPrepayment" ADD CONSTRAINT "HrPrepayment_hrWorkerId_fkey" FOREIGN KEY ("hrWorkerId") REFERENCES "HrWorker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPrepayment" ADD CONSTRAINT "HrPrepayment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPayment" ADD CONSTRAINT "HrPayment_hrWorkerId_fkey" FOREIGN KEY ("hrWorkerId") REFERENCES "HrWorker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrPayment" ADD CONSTRAINT "HrPayment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
