-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_location_id_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
