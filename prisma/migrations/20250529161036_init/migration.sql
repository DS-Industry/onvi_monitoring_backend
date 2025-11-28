-- CreateEnum
CREATE TYPE "UserNotificationType" AS ENUM ('FAVORITE', 'DELETED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduledSendAt" TIMESTAMP(3),
    "authorId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "openingAt" TIMESTAMP(3),
    "type" "UserNotificationType",

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "UserNotificationTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserNotificationTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserNotificationToUserNotificationTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserNotificationTag_AB_unique" ON "_UserToUserNotificationTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserNotificationTag_B_index" ON "_UserToUserNotificationTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserNotificationToUserNotificationTag_AB_unique" ON "_UserNotificationToUserNotificationTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserNotificationToUserNotificationTag_B_index" ON "_UserNotificationToUserNotificationTag"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserNotificationTag" ADD CONSTRAINT "_UserToUserNotificationTag_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserNotificationTag" ADD CONSTRAINT "_UserToUserNotificationTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserNotificationTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserNotificationToUserNotificationTag" ADD CONSTRAINT "_UserNotificationToUserNotificationTag_A_fkey" FOREIGN KEY ("A") REFERENCES "UserNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserNotificationToUserNotificationTag" ADD CONSTRAINT "_UserNotificationToUserNotificationTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserNotificationTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
