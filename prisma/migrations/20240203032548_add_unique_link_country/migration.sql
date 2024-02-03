/*
  Warnings:

  - A unique constraint covering the columns `[linkId,countryId]` on the table `LinkCountry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LinkCountry_linkId_countryId_key" ON "LinkCountry"("linkId", "countryId");
