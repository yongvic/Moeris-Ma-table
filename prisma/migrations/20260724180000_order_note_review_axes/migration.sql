-- AlterTable: free-text note on an order (allergies, cuisson, hors liste…)
ALTER TABLE "Order" ADD COLUMN "note" TEXT;

-- AlterTable: multi-axis review + free comment + multiple highlights
ALTER TABLE "Review" ADD COLUMN "starsService" INTEGER;
ALTER TABLE "Review" ADD COLUMN "starsPlace" INTEGER;
ALTER TABLE "Review" ADD COLUMN "comment" TEXT;
ALTER TABLE "Review" ADD COLUMN "highlights" JSONB NOT NULL DEFAULT '[]';
