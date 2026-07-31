-- Review standalone (avis sans session table) + lien Guest optionnel
ALTER TABLE "Review" ALTER COLUMN "sessionId" DROP NOT NULL;

ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "guestId" TEXT;

CREATE INDEX IF NOT EXISTS "Review_guestId_idx" ON "Review"("guestId");
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Review_guestId_fkey'
  ) THEN
    ALTER TABLE "Review"
      ADD CONSTRAINT "Review_guestId_fkey"
      FOREIGN KEY ("guestId") REFERENCES "Guest"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
