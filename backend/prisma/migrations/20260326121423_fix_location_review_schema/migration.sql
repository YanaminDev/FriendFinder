/*
  Warnings:

  - You are about to drop the column `comment` on the `Location_review` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location_review" DROP COLUMN "comment",
ADD COLUMN     "review_text" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
