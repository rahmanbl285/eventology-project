/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Events_slug_key` ON `Events`(`slug`);
