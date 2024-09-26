/*
  Warnings:

  - A unique constraint covering the columns `[shortcut]` on the table `Inc_vs_ritm_texts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Inc_vs_ritm_texts_shortcut_key` ON `Inc_vs_ritm_texts`(`shortcut`);
