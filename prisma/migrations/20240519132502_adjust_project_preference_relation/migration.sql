/*
  Warnings:

  - You are about to drop the column `projectPreferenceId` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `project_preference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `project_preference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_projectPreferenceId_fkey";

-- DropIndex
DROP INDEX "projects_projectPreferenceId_key";

-- AlterTable
ALTER TABLE "project_preference" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "projectPreferenceId";

-- CreateIndex
CREATE UNIQUE INDEX "project_preference_projectId_key" ON "project_preference"("projectId");

-- AddForeignKey
ALTER TABLE "project_preference" ADD CONSTRAINT "project_preference_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
