-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrence" "Recurrence";
