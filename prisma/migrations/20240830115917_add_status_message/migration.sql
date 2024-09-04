-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('await', 'send', 'error');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'await';
