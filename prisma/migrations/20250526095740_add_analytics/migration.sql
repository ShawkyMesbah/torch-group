-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "attachment" TEXT;

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "path" TEXT,
    "duration" INTEGER,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);
