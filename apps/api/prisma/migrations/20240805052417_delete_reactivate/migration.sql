/*
  Warnings:

  - The values [REACTIVATE] on the enum `Users_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('INACTIVE', 'ACTIVE', 'DEACTIVATE') NOT NULL DEFAULT 'INACTIVE';
