/*
  Warnings:

  - Made the column `member` on table `FollowBook` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `FollowBook` DROP FOREIGN KEY `fk_FollowBook_member`;

-- AlterTable
ALTER TABLE `FollowBook` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `FollowBook` ADD CONSTRAINT `fk_FollowBook_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
