/*
  Warnings:

  - You are about to drop the column `accountName` on the `BankDetails` table. All the data in the column will be lost.
  - Added the required column `account_name` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "accountName",
ADD COLUMN     "account_name" TEXT NOT NULL;
