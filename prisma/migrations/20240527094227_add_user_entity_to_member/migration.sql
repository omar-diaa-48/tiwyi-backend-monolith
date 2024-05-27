/*
  Warnings:

  - Added the required column `userEntityId` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "userEntityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userEntityId_fkey" FOREIGN KEY ("userEntityId") REFERENCES "user_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
