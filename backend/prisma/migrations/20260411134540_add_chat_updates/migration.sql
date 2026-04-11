/*
  Warnings:

  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Chat_Message" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'sent',
ALTER COLUMN "chatType" SET DEFAULT 'text';

-- CreateIndex
CREATE INDEX "Chat_updatedAt_idx" ON "Chat"("updatedAt");

-- CreateIndex
CREATE INDEX "Chat_Message_chat_id_createdAt_idx" ON "Chat_Message"("chat_id", "createdAt");

-- CreateIndex
CREATE INDEX "Chat_Message_isRead_idx" ON "Chat_Message"("isRead");
