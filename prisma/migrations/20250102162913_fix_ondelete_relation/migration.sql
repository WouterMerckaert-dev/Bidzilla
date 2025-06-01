-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
