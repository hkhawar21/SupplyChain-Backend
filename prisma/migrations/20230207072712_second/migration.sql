-- CreateTable
CREATE TABLE "_ProductToRaw_Material" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToRaw_Material_AB_unique" ON "_ProductToRaw_Material"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToRaw_Material_B_index" ON "_ProductToRaw_Material"("B");

-- AddForeignKey
ALTER TABLE "_ProductToRaw_Material" ADD CONSTRAINT "_ProductToRaw_Material_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRaw_Material" ADD CONSTRAINT "_ProductToRaw_Material_B_fkey" FOREIGN KEY ("B") REFERENCES "Raw_Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
