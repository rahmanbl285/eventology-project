/*
  Warnings:

  - The values [DELETED] on the enum `Users_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `referral` ADD COLUMN `referralStatus` ENUM('INACTIVE', 'ACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deactivateAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('INACTIVE', 'ACTIVE', 'DEACTIVATE', 'REACTIVATE') NOT NULL DEFAULT 'INACTIVE';
