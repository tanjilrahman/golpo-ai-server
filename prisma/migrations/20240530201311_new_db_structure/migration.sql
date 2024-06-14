/*
  Warnings:

  - You are about to drop the column `story` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `superStory` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Story` table. All the data in the column will be lost.
  - Added the required column `chapters` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "story",
DROP COLUMN "superStory",
DROP COLUMN "title",
ADD COLUMN     "chapters" JSONB NOT NULL;
