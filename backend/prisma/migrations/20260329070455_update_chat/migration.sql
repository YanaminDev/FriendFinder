/*
  Warnings:

  - You are about to drop the column `chattype` on the `Chat_Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user1_id,user2_id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatType` to the `Chat_Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Chat_Message" DROP COLUMN "chattype",
ADD COLUMN     "chatType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_user1_id_user2_id_key" ON "Chat"("user1_id", "user2_id");
