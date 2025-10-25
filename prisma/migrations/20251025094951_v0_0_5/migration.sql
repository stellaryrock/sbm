/*
  Warnings:

  - A unique constraint covering the columns `[mark,member]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mark,member]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Mark` MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `link` VARCHAR(1000) NOT NULL,
    MODIFY `image` VARCHAR(500) NULL,
    MODIFY `descript` VARCHAR(1000) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Likes_mark_member_key` ON `Likes`(`mark`, `member`);

-- CreateIndex
CREATE UNIQUE INDEX `Report_mark_member_key` ON `Report`(`mark`, `member`);
