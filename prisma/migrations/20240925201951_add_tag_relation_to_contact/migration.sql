/*
  Warnings:

  - You are about to drop the `ContactTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContactTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obs` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContactTag" DROP CONSTRAINT "ContactTag_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactTag" DROP CONSTRAINT "ContactTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "_ContactTags" DROP CONSTRAINT "_ContactTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactTags" DROP CONSTRAINT "_ContactTags_B_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "tagId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "obs" TEXT NOT NULL;

-- DropTable
DROP TABLE "ContactTag";

-- DropTable
DROP TABLE "_ContactTags";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
