-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_corporateId_fkey" FOREIGN KEY ("corporateId") REFERENCES "corporates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
