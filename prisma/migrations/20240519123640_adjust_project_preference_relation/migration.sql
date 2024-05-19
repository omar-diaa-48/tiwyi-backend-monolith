/*
  Warnings:

  - You are about to drop the column `invitationId` on the `invitations` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "invitations_invitationId_key";

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "invitationId";

-- AddForeignKey
ALTER TABLE "user_entity_enrollment" ADD CONSTRAINT "user_entity_enrollment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
