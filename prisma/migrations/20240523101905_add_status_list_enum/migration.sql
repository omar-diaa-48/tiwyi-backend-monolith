/*
  Warnings:

  - Added the required column `statusListType` to the `status_lists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusListType" AS ENUM ('CUSTOM', 'DEFAULT', 'SETTINGS');

-- AlterEnum
ALTER TYPE "CorporateType" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "DepartmentType" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "EnrollmentActionType" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "InvitationStatus" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "InvitationType" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "ProjectRequestStatus" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "ProjectRequestType" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'SETTINGS';

-- AlterEnum
ALTER TYPE "TeamType" ADD VALUE 'SETTINGS';

-- AlterTable
ALTER TABLE "status_lists" ADD COLUMN     "statusListType" "StatusListType" NOT NULL;
