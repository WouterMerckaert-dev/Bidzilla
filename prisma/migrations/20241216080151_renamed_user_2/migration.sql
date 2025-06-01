-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
