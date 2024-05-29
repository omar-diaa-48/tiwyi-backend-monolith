-- CreateTable
CREATE TABLE "task_members" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "task_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_members" ADD CONSTRAINT "task_members_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_members" ADD CONSTRAINT "task_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
