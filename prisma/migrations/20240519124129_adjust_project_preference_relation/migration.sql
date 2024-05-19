-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_projectPreferenceId_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "projectPreferenceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectPreferenceId_fkey" FOREIGN KEY ("projectPreferenceId") REFERENCES "project_preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
