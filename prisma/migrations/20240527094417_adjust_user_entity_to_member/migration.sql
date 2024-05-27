/*
  Warnings:

  - You are about to drop the column `userEntityId` on the `members` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userEntityId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "userEntityId";

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
