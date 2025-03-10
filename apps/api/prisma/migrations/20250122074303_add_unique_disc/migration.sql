/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `Discounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Discounts_usersId_key` ON `Discounts`(`usersId`);
