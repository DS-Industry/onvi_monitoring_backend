/*
  Warnings:

  - You are about to drop the `_UserToUserNotificationTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorUserId` to the `UserNotificationTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserNotificationTag" DROP CONSTRAINT "_UserToUserNotificationTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserNotificationTag" DROP CONSTRAINT "_UserToUserNotificationTag_B_fkey";

-- AlterTable
ALTER TABLE "UserNotificationTag" ADD COLUMN     "authorUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserToUserNotificationTag";

-- AddForeignKey
ALTER TABLE "UserNotificationTag" ADD CONSTRAINT "UserNotificationTag_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
