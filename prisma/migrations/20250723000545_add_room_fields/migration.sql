-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "value" TEXT;
