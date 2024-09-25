/*
  Warnings:

  - A unique constraint covering the columns `[remoteid]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_remoteid_key" ON "Contact"("remoteid");
