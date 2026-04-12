-- CreateEnum
CREATE TYPE "Notification_Type" AS ENUM ('match_request', 'match_accepted');

-- CreateEnum
CREATE TYPE "Notification_Status" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "type" "Notification_Type" NOT NULL,
    "status" "Notification_Status" NOT NULL DEFAULT 'pending',
    "position_id" TEXT,
    "activity_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_receiver_id_status_idx" ON "Notification"("receiver_id", "status");

-- CreateIndex
CREATE INDEX "Notification_sender_id_idx" ON "Notification"("sender_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;