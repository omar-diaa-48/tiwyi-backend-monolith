/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_dependsOnTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_worksheetId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "task_attachments" DROP CONSTRAINT "task_attachments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_members" DROP CONSTRAINT "task_members_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_tags" DROP CONSTRAINT "task_tags_taskId_fkey";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "worksheetId" INTEGER NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "parentTaskId" INTEGER,
    "dependsOnTaskId" INTEGER,
    "dependsOn" INTEGER,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_worksheetId_fkey" FOREIGN KEY ("worksheetId") REFERENCES "worksheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_members" ADD CONSTRAINT "task_members_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_attachments" ADD CONSTRAINT "task_attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
