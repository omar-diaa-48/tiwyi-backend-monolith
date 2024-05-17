-- CreateEnum
CREATE TYPE "EnrollmentActionType" AS ENUM ('REGISTER', 'INVITATION', 'RELATION');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('DEFAULT');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('DEFAULT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CorporateType" AS ENUM ('PERSONAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EGP', 'USD', 'EURO');

-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('CUSTOM', 'DEFAULT');

-- CreateEnum
CREATE TYPE "ProjectRequestStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectRequestType" AS ENUM ('CHANGE_REQUEST', 'INITIAL_REQUEST');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'RECEIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_entities" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_entity_enrollment" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invitationStatus" "InvitationStatus" NOT NULL,
    "enrollmentActionType" "EnrollmentActionType" NOT NULL,
    "invitationType" "InvitationType" NOT NULL,
    "invitationId" INTEGER,
    "inviterId" INTEGER,

    CONSTRAINT "user_entity_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workmatiq_invitation" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "workmatiq_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rolerover_invitation" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "rolerover_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "corporateType" "CorporateType" NOT NULL,

    CONSTRAINT "corporates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "departmentType" "DepartmentType" NOT NULL,
    "corporateId" INTEGER NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedEnd" TIMESTAMP(3) NOT NULL,
    "budget" DOUBLE PRECISION,
    "expectedRevenue" DOUBLE PRECISION,
    "actualRevenue" DOUBLE PRECISION,
    "expectedBudget" DOUBLE PRECISION,
    "actualBudget" DOUBLE PRECISION,
    "creatorId" INTEGER NOT NULL,
    "corporateId" INTEGER NOT NULL,
    "projectPreferenceId" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_request" (
    "id" SERIAL NOT NULL,
    "deadline" TIMESTAMP(3),
    "costBudget" DOUBLE PRECISION,
    "timeBudget" TEXT,
    "quote" DOUBLE PRECISION NOT NULL,
    "rejectionReason" TEXT,
    "requestType" "ProjectRequestType" NOT NULL,
    "requestStatus" "ProjectRequestStatus" NOT NULL,
    "currency" "Currency",
    "customerId" INTEGER,
    "approvedById" INTEGER NOT NULL,

    CONSTRAINT "project_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_budget" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER NOT NULL,
    "projectExpenseCategoryId" INTEGER,

    CONSTRAINT "project_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_budget" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "workspaceId" INTEGER,

    CONSTRAINT "workspace_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" SERIAL NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "workspaceId" INTEGER,
    "projectExpenseCategoryId" INTEGER,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_expense_category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "project_expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_preference" (
    "id" SERIAL NOT NULL,
    "currency" "Currency" NOT NULL,

    CONSTRAINT "project_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TeamType" NOT NULL,
    "roleId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" SERIAL NOT NULL,
    "status" "InvitationStatus" NOT NULL,
    "teamId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "payrate" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,
    "employeeId" INTEGER,
    "projectId" INTEGER NOT NULL,
    "invitationId" INTEGER,
    "teamId" INTEGER,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER NOT NULL,
    "parentWorkspaceId" INTEGER NOT NULL,
    "workspaceId" INTEGER,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worksheets" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "statusListId" INTEGER NOT NULL,

    CONSTRAINT "worksheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_lists" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "status_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifcation_recipient" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "notifcation_recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" SERIAL NOT NULL,
    "status" "Status" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_entities_email_key" ON "user_entities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_projectPreferenceId_key" ON "projects"("projectPreferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_invitationId_key" ON "invitations"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspaceId_memberId_key" ON "workspace_members"("workspaceId", "memberId");

-- AddForeignKey
ALTER TABLE "user_entities" ADD CONSTRAINT "user_entities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_entity_enrollment" ADD CONSTRAINT "user_entity_enrollment_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_corporateId_fkey" FOREIGN KEY ("corporateId") REFERENCES "corporates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectPreferenceId_fkey" FOREIGN KEY ("projectPreferenceId") REFERENCES "project_preference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_budget" ADD CONSTRAINT "project_budget_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_budget" ADD CONSTRAINT "project_budget_projectExpenseCategoryId_fkey" FOREIGN KEY ("projectExpenseCategoryId") REFERENCES "project_expense_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_budget" ADD CONSTRAINT "workspace_budget_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_projectExpenseCategoryId_fkey" FOREIGN KEY ("projectExpenseCategoryId") REFERENCES "project_expense_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_parentWorkspaceId_fkey" FOREIGN KEY ("parentWorkspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worksheets" ADD CONSTRAINT "worksheets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worksheets" ADD CONSTRAINT "worksheets_statusListId_fkey" FOREIGN KEY ("statusListId") REFERENCES "status_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_lists" ADD CONSTRAINT "status_lists_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
