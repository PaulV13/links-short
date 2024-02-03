-- CreateTable
CREATE TABLE "LinkCountry" (
    "linkId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "LinkCountry_pkey" PRIMARY KEY ("linkId","countryId")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- AddForeignKey
ALTER TABLE "LinkCountry" ADD CONSTRAINT "LinkCountry_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkCountry" ADD CONSTRAINT "LinkCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
