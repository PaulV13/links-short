-- CreateTable
CREATE TABLE "Link" (
    "url_original" TEXT NOT NULL,
    "url_short" TEXT NOT NULL,
    "visits" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_original_key" ON "Link"("url_original");

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_short_key" ON "Link"("url_short");
