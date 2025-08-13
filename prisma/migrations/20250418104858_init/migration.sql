-- CreateTable
CREATE TABLE "TechTaskTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "TechTaskTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TechTaskToTechTaskTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TechTaskToTechTaskTag_AB_unique" ON "_TechTaskToTechTaskTag"("A", "B");

-- CreateIndex
CREATE INDEX "_TechTaskToTechTaskTag_B_index" ON "_TechTaskToTechTaskTag"("B");

-- AddForeignKey
ALTER TABLE "_TechTaskToTechTaskTag" ADD CONSTRAINT "_TechTaskToTechTaskTag_A_fkey" FOREIGN KEY ("A") REFERENCES "TechTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechTaskToTechTaskTag" ADD CONSTRAINT "_TechTaskToTechTaskTag_B_fkey" FOREIGN KEY ("B") REFERENCES "TechTaskTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
