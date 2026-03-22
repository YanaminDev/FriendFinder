/*
  Warnings:

  - Added the required column `position_id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User_Information" DROP CONSTRAINT "User_Information_education_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Information" DROP CONSTRAINT "User_Information_language_id_fkey";

-- DropIndex
DROP INDEX "Match_user1_id_user2_id_location_id_activity_id_idx";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "position_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User_Information" ALTER COLUMN "user_bio" DROP NOT NULL,
ALTER COLUMN "blood_group" DROP NOT NULL,
ALTER COLUMN "language_id" DROP NOT NULL,
ALTER COLUMN "education_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Match_user1_id_user2_id_location_id_activity_id_position_id_idx" ON "Match"("user1_id", "user2_id", "location_id", "activity_id", "position_id");

-- AddForeignKey
ALTER TABLE "User_Information" ADD CONSTRAINT "User_Information_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "Education"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Information" ADD CONSTRAINT "User_Information_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
