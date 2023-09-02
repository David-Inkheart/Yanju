/*
  Warnings:

  - Added the required column `accountName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "accountName" TEXT NOT NULL;
