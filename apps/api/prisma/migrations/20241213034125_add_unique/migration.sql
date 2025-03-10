/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Events_title_key` ON `Events`(`title`);
