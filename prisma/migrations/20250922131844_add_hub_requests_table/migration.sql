-- CreateTable
CREATE TABLE "LTYProgramHubRequest" (
    "id" SERIAL NOT NULL,
    "ltyProgramId" INTEGER NOT NULL,
    "status" "LTYProgramRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,
    "requestComment" TEXT,
    "responseComment" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LTYProgramHubRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LTYProgramHubRequest_status_idx" ON "LTYProgramHubRequest"("status");

-- CreateIndex
CREATE INDEX "LTYProgramHubRequest_ltyProgramId_idx" ON "LTYProgramHubRequest"("ltyProgramId");

-- CreateIndex
CREATE INDEX "LTYProgramHubRequest_requestedAt_idx" ON "LTYProgramHubRequest"("requestedAt");

-- CreateIndex
CREATE INDEX "LTYProgramHubRequest_approvedAt_idx" ON "LTYProgramHubRequest"("approvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LTYProgramHubRequest_ltyProgramId_key" ON "LTYProgramHubRequest"("ltyProgramId");

-- AddForeignKey
ALTER TABLE "LTYProgramHubRequest" ADD CONSTRAINT "LTYProgramHubRequest_ltyProgramId_fkey" FOREIGN KEY ("ltyProgramId") REFERENCES "LTYProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LTYProgramHubRequest" ADD CONSTRAINT "LTYProgramHubRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
