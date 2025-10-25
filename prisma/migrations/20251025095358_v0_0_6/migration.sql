/*
  Warnings:

  - Made the column `member` on table `Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maker` on table `Mark` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `fk_Likes_member`;

-- DropForeignKey
ALTER TABLE `Mark` DROP FOREIGN KEY `fk_Mark_maker_Member`;

-- AlterTable
ALTER TABLE `Likes` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Mark` MODIFY `maker` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `fk_Likes_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `fk_Mark_maker_Member` FOREIGN KEY (`maker`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
