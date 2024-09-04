-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text', 'audio', 'video', 'pdf');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'text';
