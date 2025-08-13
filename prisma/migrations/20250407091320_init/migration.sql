-- CreateTable
CREATE TABLE "_LoyaltyProgramToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LoyaltyProgramToUser_AB_unique" ON "_LoyaltyProgramToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LoyaltyProgramToUser_B_index" ON "_LoyaltyProgramToUser"("B");

-- AddForeignKey
ALTER TABLE "_LoyaltyProgramToUser" ADD CONSTRAINT "_LoyaltyProgramToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LoyaltyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LoyaltyProgramToUser" ADD CONSTRAINT "_LoyaltyProgramToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
