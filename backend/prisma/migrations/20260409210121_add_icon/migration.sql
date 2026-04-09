/*
  Warnings:

  - Added the required column `icon` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Drinking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Looking_for` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Smoke` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Drinking" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Looking_for" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Smoke" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "icon" VARCHAR(50) NOT NULL;
