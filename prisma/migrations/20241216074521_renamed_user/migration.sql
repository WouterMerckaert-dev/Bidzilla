-- CreateTable
CREATE TABLE "Session" (
    "id" VARCHAR NOT NULL,
    "activeFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP + interval '1 day',
    "userId" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
