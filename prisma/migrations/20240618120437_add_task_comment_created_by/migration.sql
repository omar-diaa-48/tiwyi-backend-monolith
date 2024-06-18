/*
  Warnings:

  - Added the required column `createdById` to the `task_comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_comments" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
