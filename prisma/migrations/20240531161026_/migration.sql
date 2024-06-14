/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_authorId_key" ON "Character"("authorId");
