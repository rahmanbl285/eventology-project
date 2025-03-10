/*
  Warnings:

  - Added the required column `usersId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `usersId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
