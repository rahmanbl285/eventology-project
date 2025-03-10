/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `Points` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `usedPromo` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Points_usersId_key` ON `Points`(`usersId`);
