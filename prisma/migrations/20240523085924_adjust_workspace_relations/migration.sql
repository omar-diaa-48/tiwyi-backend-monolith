/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `workspaces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_parentWorkspaceId_fkey";

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "workspaceId",
ALTER COLUMN "parentWorkspaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_parentWorkspaceId_fkey" FOREIGN KEY ("parentWorkspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
