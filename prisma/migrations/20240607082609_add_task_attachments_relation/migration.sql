/*
  Warnings:

  - You are about to drop the `TaskTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskTag" DROP CONSTRAINT "TaskTag_projectTagId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTag" DROP CONSTRAINT "TaskTag_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_projectId_fkey";

-- DropTable
DROP TABLE "TaskTag";

-- DropTable
DROP TABLE "tags";

-- CreateTable
CREATE TABLE "project_tags" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_tags" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "projectTagId" INTEGER NOT NULL,

    CONSTRAINT "task_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_attachments" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "task_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment_thumbnails" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "attachmentId" INTEGER NOT NULL,

    CONSTRAINT "attachment_thumbnails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_projectTagId_fkey" FOREIGN KEY ("projectTagId") REFERENCES "project_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_attachments" ADD CONSTRAINT "task_attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment_thumbnails" ADD CONSTRAINT "attachment_thumbnails_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "task_attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
